import express from "express";
import { loginControllers } from "../controllers/auth.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";
import User from "../models/user.js";
import { body } from "express-validator";

const authRouter = express.Router();

authRouter.use(jsonBodyParser);

authRouter.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject("Account not exist!");
        }

        // attach user document to request so we do need to query it again
        req.user = user;
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Invalid email or password!"),
  ],
  loginControllers
);

export default authRouter;
