import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyBasePayment, USDC, TRANSFER } from '../src/base-payment.mjs';
const wallet='0x'+'12'.repeat(20), hash='0x'+'34'.repeat(32), blockHash='0x'+'56'.repeat(32);
function fixture(change=()=>{}, failDB=false) {
 const receipt={status:'0x1',transactionHash:hash,blockNumber:'0x10',blockHash,logs:[{address:USDC,topics:[TRANSFER,'0x'+'0'.repeat(64),'0x'+wallet.slice(2).padStart(64,'0')],data:'0x'+(1000n).toString(16).padStart(64,'0')}]};
 const responses={eth_chainId:'0x2105',eth_getTransactionReceipt:receipt,eth_getBlockByNumber:{hash:blockHash},eth_blockNumber:'0x11'};
 change(responses,receipt);
 const seen=new Set();
 const db={prepare:()=>({bind:(tx)=>({first:async()=>{if(failDB)throw Error('storage unavailable');if(seen.has(tx))return null;seen.add(tx);return {tx_hash:tx};}})})};
 const rpc=async (_url,init)=>new Response(JSON.stringify({result:responses[JSON.parse(init.body).method]}));
 return {db,rpc};
}
async function verify(change,proof=hash,env={PAYMENT_WALLET:wallet},failDB=false){const {db,rpc}=fixture(change,failDB);return verifyBasePayment(env,db,proof,rpc);}
test('single use, including concurrent requests',async()=>{const {db,rpc}=fixture();const results=await Promise.all([verifyBasePayment({PAYMENT_WALLET:wallet},db,hash,rpc),verifyBasePayment({PAYMENT_WALLET:wallet},db,hash,rpc)]);assert.equal(results.filter(x=>x.ok).length,1);assert.equal(results.filter(x=>x.status===402).length,1);});
for(const [name,change] of [
 ['wrong chain',r=>r.eth_chainId='0x1'],['pending',r=>r.eth_getTransactionReceipt=null],
 ['reverted',(_,r)=>r.status='0x0'],['wrong transaction',(_,r)=>r.transactionHash='0x'+'ab'.repeat(32)],
 ['reorg',r=>r.eth_getBlockByNumber.hash='0x'+'ab'.repeat(32)],['unconfirmed head',r=>r.eth_blockNumber='0xf'],
 ['wrong token',(_,r)=>r.logs[0].address=wallet],['wrong recipient',(_,r)=>r.logs[0].topics[2]='0x'+'0'.repeat(64)],
 ['underpayment',(_,r)=>r.logs[0].data='0x'+(999n).toString(16).padStart(64,'0')],['removed log',(_,r)=>r.logs[0].removed=true]
]) test(name,async()=>assert.equal((await verify(change)).status,402));
test('arbitrary proof',async()=>assert.equal((await verify(undefined,'paid')).status,402));
test('missing wallet',async()=>assert.equal((await verify(undefined,hash,{})).status,503));
test('storage failure',async()=>assert.equal((await verify(undefined,hash,undefined,true)).status,402));
test('RPC failure',async()=>assert.equal((await verifyBasePayment({PAYMENT_WALLET:wallet},{},hash,async()=>{throw Error('offline')})).status,402));
test('invalid JSON',async()=>assert.equal((await verifyBasePayment({PAYMENT_WALLET:wallet},{},hash,async()=>new Response('bad'))).status,402));
import { readFile } from 'node:fs/promises';
const source=(await readFile(new URL('../src/index.js',import.meta.url),'utf8')).replace("'./base-payment.mjs'",JSON.stringify(new URL('../src/base-payment.mjs',import.meta.url).href));
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const [name,path,init] of [
 ['paid REST','/agent-query/test',{headers:{'X-Payment':'arbitrary'}}],
 ['paid MCP','/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'paid_trust_verdict',arguments:{server_url:'https://example.com',payment_tx:'arbitrary'}}})}]
]) test(name+' rejects arbitrary proof without D1 or network',async()=>{const response=await worker.fetch(new Request('https://example.com'+path,init),{PAYMENT_WALLET:wallet,DB:{prepare(){throw Error('unexpected D1 read')}}},{});assert.equal(response.status,402);});
test('payment config fails closed with missing secret',async()=>{const response=await worker.fetch(new Request('https://example.com/api/payment-info'),{DB:{}},{});assert.equal(response.status,503);});
