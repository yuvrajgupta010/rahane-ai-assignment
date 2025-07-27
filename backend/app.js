import env from "dotenv";
env.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./routes/auth.js";
import { mongoDBConnection } from "./config/mongoDB.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.js";
import { createAdminUserIfNotExists } from "./helpers/initAdminUser.js";
import dataRouter from "./routes/data.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use(helmet());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is running",
  });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/data", dataRouter);

// Not found
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = "404 NOT FOUND";
  next(error);
});

app.use(errorMiddleware);

mongoDBConnection.then(async () => {
  console.log("Successfully connected to DB");

  await createAdminUserIfNotExists();

  app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`);
  });
});
