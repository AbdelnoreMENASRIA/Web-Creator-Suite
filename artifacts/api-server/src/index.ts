import app from "./app";
import { logger } from "./lib/logger";
import { execSync } from "child_process";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Run database migrations on startup
async function runMigrations() {
  try {
    logger.info("Running database migrations...");
    execSync("cd ../../lib/db && npx drizzle-kit push", { cwd: process.cwd(), stdio: "inherit" });
    logger.info("Migrations completed successfully");
  } catch (err) {
    logger.error({ err }, "Migration failed, but continuing server startup");
    // Don't exit - let the server start anyway
  }
}

// Run migrations then start server
runMigrations().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});
