import express from "express";
import helmet from "helmet";
import cors from "cors";
import { configData } from "./utils/config.js";
import { ApiRouter } from "./routers/api.js";
import { setupSwagger } from "./utils/swagger.js";
import { appErrorMiddleware, zodErrorMiddleware } from "./utils/error.js";

// Main server
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link to the routers
app.use("/api", ApiRouter.router);

// Server the documentation UI
setupSwagger(app, ApiRouter.docs);

// *MUST BE LAST*
// Error handling middleware
app.use(zodErrorMiddleware);
app.use(appErrorMiddleware);

// Start the server
app.listen(configData.PORT, () => {
  console.log(`Server running at ${configData.PORT}`);
});
