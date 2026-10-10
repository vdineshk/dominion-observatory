CREATE TABLE IF NOT EXISTS x402_payment_uses (
  tx_hash TEXT PRIMARY KEY NOT NULL,
  recipient TEXT NOT NULL,
  amount_atomic TEXT NOT NULL,
  block_number TEXT NOT NULL,
  consumed_at TEXT NOT NULL
);
