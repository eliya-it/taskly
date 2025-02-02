import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
import { execSync } from "child_process";
import request from "supertest";
import { app } from "../app";
import { NextFunction, Response, Request } from "express";
import { CustomRequest } from "@taskly/shared";

let pool: Pool;
pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "amsq9367",
  database: "taskly",
});
declare global {
  namespace NodeJS {
    interface Global {
      login(): Promise<string[]>;
    }
  }
}
beforeAll(async () => {
  execSync(`psql -U postgres -c "DROP DATABASE IF EXISTS taskly;"`, {
    env: { ...process.env, PGPASSWORD: "amsq9367" },
  });

  execSync(`psql -U postgres -c "CREATE DATABASE taskly;"`, {
    env: { ...process.env, PGPASSWORD: "amsq9367" },
  });

  await pool.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL CHECK (LENGTH(email) BETWEEN 5 AND 254), 
  name VARCHAR(32) NOT NULL CHECK (LENGTH(name) BETWEEN 3 AND 32), 
  password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8),     
  confirm_password VARCHAR(255), 
  password_reset_token VARCHAR(255),  
  password_reset_expires TIMESTAMP,  
  CONSTRAINT unique_email UNIQUE (email) 
);
  `);
});

afterAll(async () => {
  execSync(
    `psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'taskly';"`,
    {
      env: { ...process.env, PGPASSWORD: "amsq9367" },
    }
  );

  execSync(`psql -U postgres -c "DROP DATABASE IF EXISTS taskly;"`, {
    env: { ...process.env, PGPASSWORD: "amsq9367" },
  });

  await pool.end();
});
