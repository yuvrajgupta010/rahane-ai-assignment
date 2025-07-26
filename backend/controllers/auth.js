import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { jwtSignToken } from "../helpers/jwt.js";
import expressValidation from "../helpers/validation.js";
import SystemLog from "../models/systemLog.js";
import User from "../models/user.js";

export const loginControllers = async (req, res, next) => {
  try {
    expressValidation(req);

    const { email, password } = req.body;

    const passwordResult = await comparePassword(password, req.user.password);

    if (!passwordResult) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }

    const token = jwtSignToken({
      userId: req.user.id,
      userRole: req?.user?.role,
    });

    return res.status(200).json({
      data: {
        user: req.user.toClient(),
        accessToken: token,
      },
      message: "Login successfully.",
    });
  } catch (error) {
    next(error);
  } finally {
    const systemLog = new SystemLog({
      action: "User Login",
      userId: req.user.id,
      details: `User ${req.user.email} logged in successfully.`,
      adminId: req.user?.createdBy || null,
    });
    await systemLog.save();
  }
};
