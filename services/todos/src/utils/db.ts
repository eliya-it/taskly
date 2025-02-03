import { Pool } from "pg";

// Function to ensure tables exist
export async function ensureTablesExist(): Promise<void> {
  const pool: Pool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT!),
    user: process.env.PGUSER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.PGDB!,
  });
  const client = await pool.connect();
  try {
    // SQL query to create the "todos" table if it doesn't exist
    const query = `
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL CHECK (LENGTH(name) BETWEEN 2 AND 120),
  urgent BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'finished')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;
    await client.query(query);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
}
