CREATE TABLE IF NOT EXISTS treasury (
    id SERIAL PRIMARY KEY,
    balance_usd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(50) PRIMARY KEY,
    amount_usd DECIMAL(15, 2) NOT NULL,
    amount_inr DECIMAL(15, 2) NOT NULL,
    rate DECIMAL(10, 4) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    quote_id VARCHAR(50) REFERENCES quotes(id),
    sender_id VARCHAR(50) NOT NULL,
    amount_usd DECIMAL(15, 2) NOT NULL,
    amount_inr DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    bank_details JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial treasury balance if not exists
INSERT INTO treasury (id, balance_usd)
VALUES (1, 10000.00)
ON CONFLICT (id) DO NOTHING;
