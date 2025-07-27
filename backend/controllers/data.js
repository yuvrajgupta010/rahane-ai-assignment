import { hashPassword } from "../helpers/bcrypt.js";
import expressValidation from "../helpers/validation.js";
import SystemLog from "../models/systemLog.js";
import User from "../models/user.js";

export const getSystemLogsController = async (req, res, next) => {
  try {
    expressValidation(req);

    const { userId } = req.jwtPayload;

    const logs = await SystemLog.find({ adminId: userId })
      .populate("userId", "email name")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      data: { logs },
      message: "System logs fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// export const getStatic
