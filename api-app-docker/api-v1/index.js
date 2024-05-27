const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Function to create table and insert data
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    await client.query(`
      INSERT INTO items (name) VALUES
      ('Nagp 1'),
      ('Nagp 2'),
      ('Nagp 3')
      ON CONFLICT DO NOTHING;
    `);
  } catch (err) {
    console.error('Error initializing database', err);
  } finally {
    client.release();
  }
};

// Endpoint to get items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database', err);
    res.status(500).send('Internal Server Error');
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
});
