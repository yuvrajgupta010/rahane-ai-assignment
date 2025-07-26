import { hashPassword } from "../helpers/bcrypt.js";
import expressValidation from "../helpers/validation.js";
import SystemLog from "../models/systemLog.js";
import User from "../models/user.js";

export const createAccountController = async (req, res, next) => {
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

    return res.status(201).json({
      data: { user: user.toClient() },
      message: "Account created successfully.",
    });
  } catch (error) {
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Account Creation",
      userId: req.jwtPayload.userId,
      details: `User ${req.body.email} created an account successfully.`,
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
  } finally {
    const systemLog = new SystemLog({
      action: "Fetch All Users",
      userId: req.jwtPayload.userId,
      details: "Fetched all users successfully.",
      adminId: req.jwtPayload.userId,
    });
    await systemLog.save();
  }
};

export const editUserController = async (req, res, next) => {
  try {
    expressValidation(req);

    const { email, fullName, role } = req.body;

    req.user.email = email;
    req.user.fullName = fullName;
    req.user.role = role;

    await req.user.save();

    return res.status(204).json({
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Update",
      userId: req.user.id,
      details: `User ${req.user.email} profile updated successfully.`,
      adminId: req.jwtPayload.userId, // Assuming the user making the edit is the admin
    });
    await systemLog.save();
  }
};

export const deleteUserController = async (req, res, next) => {
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

    return res.status(204).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Deletion",
      userId: req.jwtPayload.userId,
      details: `User ${req.user.email} deleted successfully.`,
      adminId: req.jwtPayload.userId, // Assuming the user making the deletion is the admin
    });
    await systemLog.save();
  }
};
