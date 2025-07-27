import { hashPassword } from "../helpers/bcrypt.js";
import CONSTANT from "../helpers/constant.js";
import expressValidation from "../helpers/validation.js";
import Post from "../models/post.js";
import SystemLog from "../models/systemLog.js";
import User from "../models/user.js";

export const getSystemLogsController = async (req, res, next) => {
  try {
    expressValidation(req);

    const { userId } = req.jwtPayload;

    const logs = await SystemLog.find({ adminId: userId })
      .populate("userId", "email fullName role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      data: { logs: logs.map((user) => user.toClient()) },
      message: "System logs fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStatController = async (req, res, next) => {
  try {
    const { userId } = req.jwtPayload;
    console.log("I am hitting");
    const totalUsers = await User.find({
      createdBy: userId,
    }).countDocuments();
    const totalSystemLogs = await SystemLog.find({
      adminId: userId,
    }).countDocuments();

    return res.status(200).json({
      data: {
        totalUsers,
        totalSystemLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
