require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ── Initialize Database Connection ───────────────────────────
require("./db");

const { verifyToken } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const requestLogger = require("./middleware/requestLogger");
const pool = require("./db");

const authRouter = require("./routes/auth.routes");
const statsRouter = require("./routes/stats.routes");
const platformsRouter = require("./routes/platforms.routes");
const donationsRouter = require("./routes/donations.routes");
const socialFetchRouter = require("./routes/socialFetch.routes");
const proxyRouter = require("./routes/proxy.routes");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://fe-nesaverse.vercel.app",
  "https://nesaverse.my.id",
  "https://www.nesaverse.my.id",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

// ── Middleware ─────────────────────────────────────────────────
app.use(requestLogger);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

// ── Swagger UI (skip on Vercel) ───────────────────────────────
if (!process.env.VERCEL) {
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./swagger");
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "NesaVerse API Docs",
    }),
  );
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
}

// ── Root ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Backend berjalan dengan PostgreSQL");
});

// ── Public Routes ──────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter);
app.use("/api/platforms", platformsRouter);
app.use("/api/donations", donationsRouter);
app.use("/api/social", socialFetchRouter);
app.use("/api/proxy", proxyRouter);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", time: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "error", db: "disconnected", time: new Date().toISOString() });
  }
});

// ── 404 & Error Handler ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
