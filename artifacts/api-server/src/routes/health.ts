import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Health check endpoint
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Test database connection
router.get("/db-test", async (_req, res) => {
  try {
    const { db } = await import("@workspace/db");
    
    // Try to query the users table
    const result = await db.select().from(await import("@workspace/db").then(m => m.usersTable));
    
    res.json({ 
      status: "ok",
      message: "Database connection successful",
      usersTableExists: true,
      userCount: result.length
    });
  } catch (error) {
    logger.error({ error }, "Database test failed");
    res.status(500).json({ 
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

export default router;
