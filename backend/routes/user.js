import express from "express";
import { body, param } from "express-validator";

import { authenticateTokenAndAccess } from "../middlewares/jwt.js";
import { jsonBodyParser } from "../middlewares/bodyParser.js";
import User from "../models/user.js";

import {
  addCommentController,
  createAccountController,
  createPostController,
  deletePostController,
  deleteUserController,
  editPostController,
  editUserController,
  getAllUsersController,
  getPostsController,
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
        const { userId } = req.jwtPayload;
        const user = await User.findOne({ email: value, createdBy: userId });
        if (!user) {
          return Promise.reject("Account don't exists with this email!");
        }

        req.user = user;
      }),
    body("role")
      .trim()
      .isIn([CONSTANT.ROLE_ADMIN, CONSTANT.ROLE_EDITOR, CONSTANT.ROLE_VIEWER])
      .withMessage("Role must be one of: admin, editor, viewer"),
  ],
  editUserController
);

userRouter.put(
  "/delete-user",
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

userRouter.get("/post", getPostsController);

userRouter.post(
  "/post",
  [
    body("title").trim().notEmpty().withMessage("Please enter title"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please provide description"),
  ],
  createPostController
);

userRouter.put(
  "/post",
  [
    body("title").trim().notEmpty().withMessage("Please enter title"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Please provide description"),
    body("postId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid post ID format."),
  ],
  editPostController
);

userRouter.put(
  "/delete-post",
  [
    body("postId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid post ID format"),
  ],
  deletePostController
);

userRouter.post(
  "/comment",
  [
    body("postId").isMongoId().withMessage("Invalid post ID format"),
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("Comment not have to be empty"),
  ],
  addCommentController
);

export default userRouter;
