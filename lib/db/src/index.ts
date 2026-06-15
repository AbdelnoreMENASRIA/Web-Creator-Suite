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

// Force SSL/TLS for production (Render requires this)
if (isProduction) {
  dbUrl.searchParams.set("sslmode", "require");
}

export const pool = new Pool({ 
  connectionString: dbUrl.toString(),
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
