export const USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
export const TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
export function paymentWallet(env) {
  const value = env.PAYMENT_WALLET;
  return typeof value === 'string' && /^0x[0-9a-f]{40}$/i.test(value) && !/^0x0{40}$/i.test(value) ? value.toLowerCase() : null;
}
export function paymentError(error, status = 402) {
  return new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
export async function verifyBasePayment(env, db, hash, rpcFetch = fetch) {
  const wallet = paymentWallet(env);
  if (!wallet) return { error: 'PAYMENT_WALLET_not_configured', status: 503 };
  if (!/^0x[0-9a-f]{64}$/i.test(hash || '')) return { error: 'invalid_payment_transaction', status: 402 };
  hash = hash.toLowerCase();
  async function rpc(method, params) {
    const response = await rpcFetch(env.BASE_RPC_URL || 'https://mainnet.base.org', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('rpc_unavailable');
    const body = await response.json();
    if (body.error || !Object.hasOwn(body, 'result')) throw new Error('rpc_invalid_response');
    return body.result;
  }
  try {
    if (BigInt(await rpc('eth_chainId', [])) !== 8453n) throw new Error('wrong_chain');
    const receipt = await rpc('eth_getTransactionReceipt', [hash]);
    if (!receipt || receipt.status !== '0x1' || receipt.transactionHash?.toLowerCase() !== hash || !receipt.blockNumber || !receipt.blockHash) throw new Error('transaction_not_confirmed');
    const block = await rpc('eth_getBlockByNumber', [receipt.blockNumber, false]);
    const head = await rpc('eth_blockNumber', []);
    if (block?.hash?.toLowerCase() !== receipt.blockHash.toLowerCase() || BigInt(head) < BigInt(receipt.blockNumber)) throw new Error('transaction_not_canonical');
    const recipient = '0x' + wallet.slice(2).padStart(64, '0');
    let amount = 0n;
    for (const log of receipt.logs || []) {
      if (log.removed || log.address?.toLowerCase() !== USDC || log.topics?.length !== 3 || log.topics[0]?.toLowerCase() !== TRANSFER || log.topics[2]?.toLowerCase() !== recipient || !/^0x[0-9a-f]{64}$/i.test(log.data || '')) continue;
      amount += BigInt(log.data);
    }
    if (amount < 1000n) throw new Error('insufficient_USDC_payment');
    // A unique primary key atomically consumes the proof across every paid path.
    // Missing schema/storage errors fail closed; no runtime schema creation.
    const used = await db.prepare('INSERT OR IGNORE INTO x402_payment_uses (tx_hash, recipient, amount_atomic, block_number, consumed_at) VALUES (?, ?, ?, ?, ?) RETURNING tx_hash')
      .bind(hash, wallet, amount.toString(), receipt.blockNumber, new Date().toISOString()).first();
    if (!used) throw new Error('payment_already_used');
    return { ok: true, transaction: hash, amount: amount.toString() };
  } catch (error) {
    return { error: 'payment_verification_failed', reason: error.message, status: 402 };
  }
}
