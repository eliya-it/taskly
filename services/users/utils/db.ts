import { Pool } from "pg";

export async function ensureUsersTableExist(): Promise<void> {
  const pool: Pool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT!),
    user: process.env.PGUSER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.PGDB!,
  });

  const client = await pool.connect();

  try {
    const query = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL CHECK (LENGTH(name) BETWEEN 2 AND 50),
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(120) NOT NULL CHECK (LENGTH(password) BETWEEN 8 AND 120),
  confirm_password VARCHAR(120),
  password_reset_token VARCHAR(120),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
    await client.query(query);
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    client.release();
  }
}
