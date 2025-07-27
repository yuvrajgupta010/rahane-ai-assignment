import express from "express";

import { authenticateTokenAndAccess } from "../middlewares/jwt.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";

import {
  getDashboardStatController,
  getSystemLogsController,
} from "../controllers/data.js";

const dataRouter = express.Router();

// dataRouter.use(jsonBodyParser);
dataRouter.use(authenticateTokenAndAccess);

dataRouter.get("/system-logs", getSystemLogsController);

dataRouter.get("/dashboard-stat", getDashboardStatController);

export default dataRouter;
