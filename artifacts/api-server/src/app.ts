import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Configure CORS to allow requests from production and development frontends
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:3000",  // Alternative local port
  "https://teach-in-english-front.onrender.com", // Production frontend on Render
];

// Add FRONTEND_URL if defined and different
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL !== "https://teach-in-english-front.onrender.com") {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

logger.info({ allowedOrigins }, "CORS allowed origins configured");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV === "development") {
        // In development, log but allow all origins
        logger.warn({ origin }, "CORS request from unlisted origin (development mode - allowed)");
        callback(null, true);
      } else {
        logger.error({ origin, allowedOrigins }, "CORS blocked request from unauthorized origin");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Global error handler - catches all unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ 
    err, 
    message: err.message, 
    stack: err.stack,
    url: req.url,
    method: req.method,
  }, "Unhandled error");

  // Don't expose error details in production
  const message = process.env.NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message || "Internal server error";

  res.status(err.status || 500).json({ 
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

export default app;
