import { hashPassword } from "../helpers/bcrypt.js";
import expressValidation from "../helpers/validation.js";
import Post from "../models/post.js";
import SystemLog from "../models/systemLog.js";
import User from "../models/user.js";

export const createAccountController = async (req, res, next) => {
  let finalMessage;
  try {
    expressValidation(req);

    const { email, password, fullName, role } = req.body;
    const { userId } = req.jwtPayload;

    const encryptedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: encryptedPassword,
      fullName,
      role: role,
      createdBy: userId,
    });

    await user.save();

    finalMessage = `User ${req.body.email} created an account successfully.`;

    return res.status(201).json({
      data: { user: user.toClient() },
      message: "Account created successfully.",
    });
  } catch (error) {
    finalMessage = error.message;

    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Account Creation",
      userId: req.jwtPayload.userId,
      details: finalMessage,
      adminId: req.jwtPayload.userId,
    });
    await systemLog.save();
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    expressValidation(req);
    const { userId } = req.jwtPayload;

    const users = await User.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      data: { users: users.map((user) => user.toClient()) },
      message: "Users fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const editUserController = async (req, res, next) => {
  let finalMessage;
  try {
    expressValidation(req);

    const { email, fullName, role } = req.body;

    req.user.fullName = fullName;
    req.user.role = role;

    await req.user.save();

    finalMessage = `User ${email} updated successfully!`;
    return res.status(200).json({
      data: {
        user: req.user.toClient(),
      },
      message: "User updated successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Update",
      userId: req.jwtPayload.userId,
      details: finalMessage,
      adminId: req.jwtPayload.userId, // Assuming the user making the edit is the admin
    });
    await systemLog.save();
  }
};

export const deleteUserController = async (req, res, next) => {
  let finalMessage;
  try {
    expressValidation(req);

    const { userId } = req.jwtPayload;

    const user = await User.deleteOne({
      _id: req.user._id,
      createdBy: userId,
    });
    if (!user.deletedCount) {
      const error = new Error(
        "User not found or you do not have permission to delete this user."
      );
      error.status = 404;
      throw error;
    }

    finalMessage = `User ${req.user.email} deleted successfully.`;
    return res.status(204).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Deletion",
      userId: req.jwtPayload.userId,
      details: finalMessage,
      adminId: req.jwtPayload.userId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};

export const getPostsController = async (req, res, next) => {
  try {
    const { userId, adminId } = req.jwtPayload;

    const post = await Post.find({
      adminId: adminId,
    })
      .populate("createdBy", "fullName email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      data: {
        posts: post.map((post) => post.toClient()),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req, res, next) => {
  let finalMessage;
  try {
    const { userId, adminId } = req.jwtPayload;
    const { title, description } = req.body;

    const post = await Post.create({
      title: title,
      description: description,
      createdBy: userId,
      adminId: adminId,
      comments: [],
    });

    finalMessage = "Post created sucessfully successfully!";

    return res.status(201).json({
      data: {
        post: post.toClient(),
      },
      message: "Post creted successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "Create Post",
      userId: req?.jwtPayload?.userId,
      details: finalMessage,
      adminId: req?.jwtPayload?.adminId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};

export const editPostController = async (req, res, next) => {
  let finalMessage;
  try {
    expressValidation(req);
    const { userId, adminId } = req.jwtPayload;
    const { title, description, postId } = req.body;

    const post = await Post.findOne({
      _id: postId,
      createdBy: userId,
    }).populate("createdBy");

    if (!post) {
      const error = new Error("Post not found!");
      error.status = 404;
      throw error;
    }

    post.title = title;
    post.description = description;

    await post.save();

    finalMessage = "Post updated successfully";
    return res.status(200).json({
      data: {
        post: post.toClient(),
      },
      message: "Post updated successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "Edit Post",
      userId: req?.jwtPayload?.userId,
      details: finalMessage,
      adminId: req?.jwtPayload?.adminId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};

export const deletePostController = async (req, res, next) => {
  let finalMessage;
  try {
    expressValidation(req);
    const { adminId, userId } = req.jwtPayload;
    const { postId } = req.body;

    const post = await Post.deleteOne({ _id: postId, createdBy: userId });
    // const post = await Post.findById(postId);

    if (!post.deletedCount) {
      const error = new Error("Post not found!");
      error.status = 404;
      throw error;
    }

    finalMessage = "Post deleted successfully";
    return res.status(204).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "Delete Post",
      userId: req?.jwtPayload?.userId,
      details: finalMessage,
      adminId: req?.jwtPayload?.adminId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};

export const addCommentController = async (req, res, next) => {
  let finalMessage;
  try {
    const { userId, adminId } = req.jwtPayload;
    const { postId, comment: commentContent } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Post not found!");
      error.status = 404;
      throw error;
    }

    const comment = await Comment.create({
      comment: commentContent,
      postId: postId,
    });

    post.comments.push(comment._id);
    await post.save();

    finalMessage = "Comment added successfully";
    return res.status(201).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    finalMessage = error.message;
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "Add Comment",
      userId: req?.jwtPayload?.userId,
      details: finalMessage,
      adminId: req?.jwtPayload?.adminId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};
