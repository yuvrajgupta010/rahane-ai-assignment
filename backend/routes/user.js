import express from "express";
import { body } from "express-validator";

import { authenticateTokenAndAccess } from "../middlewares/jwt.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";
import User from "../models/user.js";

import {
  createAccountController,
  deleteUserController,
  editUserController,
  getAllUsersController,
} from "../controllers/user.js";
import CONSTANT from "../helpers/constant.js";

const userRouter = express.Router();

userRouter.use(jsonBodyParser);
userRouter.use(authenticateTokenAndAccess);

userRouter.post(
  "/create-account",
  [
    body("fullName")
      .isString()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your full name"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Account already exists with this email!");
        }
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required.")
      .isIn([CONSTANT.ROLE_ADMIN, CONSTANT.ROLE_EDITOR, CONSTANT.ROLE_VIEWER])
      .withMessage("Role must be one of: admin, editor, viewer"),
  ],
  createAccountController
);

userRouter.get("/all-users", getAllUsersController);

userRouter.put(
  "/edit-user",
  [
    body("fullName")
      .optional()
      .isString()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your full name"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Account don't exists with this email!");
        }

        req.user = user;
      }),
    body("role")
      .optional()
      .trim()
      .isIn([CONSTANT.ROLE_ADMIN, CONSTANT.ROLE_EDITOR, CONSTANT.ROLE_VIEWER])
      .withMessage("Role must be one of: admin, editor, viewer"),
  ],
  editUserController
);

userRouter.delete(
  "/delete-user/:userId",
  [
    body("userId")
      .isMongoId()
      .withMessage("Invalid user ID format.")
      .custom(async (value, { req }) => {
        const user = await User.findById(value);
        if (!user) {
          return Promise.reject("User does not exist.");
        }
        req.user = user;
      }),
  ],
  deleteUserController
);

export default userRouter;
