# راهنمای ساخت Backend سفارشی

## نصب PostgreSQL

1. PostgreSQL را از https://www.postgresql.org/download دانلود کنید
2. نصب کنید و یک دیتابیس به نام `rabik_db` بسازید

## ساخت Backend با Express

```bash
mkdir backend
cd backend
npm init -y
npm install express pg cors dotenv bcrypt jsonwebtoken
```

## ساخت فایل backend/server.js

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'rabik_db',
  user: 'postgres',
  password: 'your_password'
});

// Customers API
app.get('/api/customers', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/customers', async (req, res) => {
  const { full_name, email, phone, company_name, status } = req.body;
  const result = await pool.query(
    'INSERT INTO customers (full_name, email, phone, company_name, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [full_name, email, phone, company_name, status]
  );
  res.json(result.rows[0]);
});

app.listen(3001, () => console.log('Backend running on port 3001'));
```

## اجرای Migrations

```bash
psql -U postgres -d rabik_db -f supabase/migrations/20250115000000_crm_system_base.sql
```

## تغییر Frontend

در `src/lib/crm-helpers.ts` به جای Supabase از fetch استفاده کنید:

```typescript
export const getCustomers = async () => {
  const response = await fetch('http://localhost:3001/api/customers');
  return response.json();
};

export const createCustomer = async (customer) => {
  const response = await fetch('http://localhost:3001/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  });
  return response.json();
};
```

## اجرا

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```
