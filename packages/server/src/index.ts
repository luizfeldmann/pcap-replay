import express from "express";
import helmet from "helmet";
import cors from "cors";
import { configData } from "./utils/config.js";
import Api from "./routers/api.js";
import { setupSwagger } from "./utils/swagger.js";

// Main server
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link to the routers
app.use("/api", Api.router);

// Server the documentation UI
setupSwagger(app, Api.docs);

// Start the server
app.listen(configData.PORT, () => {
  console.log(`Server running at ${configData.PORT}`);
});
