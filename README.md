# USD-INR Transfer System

A blockchain-style USD to INR transfer system built with Express.js.

## Features
- **Quotation**: Get real-time (mocked) exchange rates.
- **Transaction**: Create transactions and track status.
- **Webhook**: Simulate asynchronous status updates.
- **In-Memory Store**: Data is stored in memory (resets on restart).

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Server**:
    ```bash
    npm start
    ```
    Server runs on `http://localhost:3000`.

## API Documentation & Postman Samples

### 1. Get Quotation
**Endpoint**: `POST /api/quotation`
**Description**: Get the current exchange rate and calculated INR amount.

**Body**:
```json
{
  "amountUSD": 100
}
```

**Response**:
```json
{
  "amountUSD": 100,
  "exchangeRate": 83.2,
  "targetAmountINR": 8320
}
```

### 2. Create Transaction
**Endpoint**: `POST /api/transaction`
**Description**: Create a new transfer transaction.

**Body**:
```json
{
  "amountUSD": 100,
  "exchangeRate": 83.2,
  "targetAmountINR": 8320
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "amountUSD": 100,
  "exchangeRate": 83.2,
  "targetAmountINR": 8320,
  "status": "PENDING",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

### 3. Get Transaction Details
**Endpoint**: `GET /api/transaction/:id`
**Description**: Fetch details of a specific transaction.

### 4. List All Transactions
**Endpoint**: `GET /api/transactions`
**Description**: List all transactions.

### 5. Webhook (Manual Status Update)
**Endpoint**: `POST /api/webhook`
**Description**: Manually update transaction status (simulating a callback).

**Body**:
```json
{
  "transactionId": "uuid-string-from-create-transaction",
  "status": "COMPLETED"
}
```

**Response**:
```json
{
  "message": "Transaction updated successfully",
  "transaction": { ... }
}
```
