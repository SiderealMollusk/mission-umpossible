const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5001;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Configure Postgres connection (fill in your credentials)
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'postgres',  // Changed 'localhost' to 'postgres'
  database: process.env.PGDATABASE || 'appdb',  // Changed 'postgres' to 'appdb'
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
});

// POST /login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('[Login] Missing email or password');
    return res.status(400).json({ error: 'Missing email or password' });
  }
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, password FROM users WHERE email = $1',
        [email]
      );
      if (result.rows.length === 0) {
        console.log(`[Login] Failed login for email: ${email} (user not found)`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = result.rows[0];
      // In production, use: await bcrypt.compare(password, user.password)
      const passwordMatches = password === user.password;
      // const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        console.log(`[Login] Failed login for email: ${email} (wrong password)`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      console.log(`[Login] Successful login for email: ${email}`);
      // In production, generate and send a token here.
      res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Login] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /me route
app.get('/me', (req, res) => {
  res.json({ message: "This is a static response from /me" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});