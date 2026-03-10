import express from "express";
import helmet from "helmet";
import cors from "cors";
import { configData } from "./utils/config.js";
import { ApiRouter } from "./routers/api.js";
import { setupSwagger } from "./utils/swagger.js";
import {
  appErrorMiddleware,
  zodErrorMiddleware,
  sqlErrorMiddleware,
} from "./utils/error.js";
import {
  performHousekeeping,
  startWorkers,
  stopWorkers,
} from "./workers/workers.js";
import path from "path";
import { fileURLToPath } from "url";
import { spaFallbackMiddleware } from "./utils/spa.js";

// Perform housekeeping before startup
await performHousekeeping();

// Leave background workers ready
startWorkers();

// Main server
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link to the routers
const API_PREFIX = "/api";
app.use(API_PREFIX, ApiRouter.router);

// Server the documentation UI
setupSwagger(app, ApiRouter.getDocs(API_PREFIX));

// Serve static files
const indexFilename = fileURLToPath(import.meta.url);
const indexDirectory = path.dirname(indexFilename);
const publicDir = path.resolve(indexDirectory, "..", "public");
console.log(`serving client from ${publicDir}`);
app.use(express.static(publicDir));

// SPA fallback
app.use(spaFallbackMiddleware(API_PREFIX, publicDir));

// *MUST BE LAST*
// Error handling middleware
app.use(zodErrorMiddleware);
app.use(sqlErrorMiddleware);
app.use(appErrorMiddleware);

// Start the server
const server = app.listen(configData.PORT, () => {
  console.log(`Server running at ${configData.PORT}`);
});

// Register gracious shutdown hooks
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("Begin shutdown...");
  server.close(() => {
    stopWorkers();
    console.log("Shutdown finished");
  });
}
