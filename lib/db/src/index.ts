import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse DATABASE_URL and ensure SSL is required for production
const dbUrl = new URL(process.env.DATABASE_URL);
const isProduction = process.env.NODE_ENV === "production";

// Force SSL/TLS with verify-full for production (Render requires this)
if (isProduction) {
  dbUrl.searchParams.set("sslmode", "verify-full");
}

// Create pool with IPv4 preference
const poolConfig: any = { 
  connectionString: dbUrl.toString(),
  ssl: isProduction ? { rejectUnauthorized: true } : false,
};

// Force IPv4 and set connection timeouts
if (isProduction) {
  poolConfig.family = 4; // Prefer IPv4
  poolConfig.statement_timeout = 30000; // 30s statement timeout
  poolConfig.query_timeout = 30000; // 30s query timeout
}

export const pool = new Pool(poolConfig);

export const db = drizzle(pool, { schema });

export * from "./schema";
