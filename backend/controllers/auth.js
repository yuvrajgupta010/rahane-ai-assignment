import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { jwtSignToken } from "../helpers/jwt.js";
import expressValidation from "../helpers/validation.js";
import User from "../models/user.js";

export const signupController = async (req, res, next) => {
  try {
    expressValidation(req);

    const { email, password, fullName } = req.body;

    const encryptedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: encryptedPassword,
      fullName,
    });

    await user.save();

    return res.status(201).json({
      data: { user: user.toClient() },
      message: "Account created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

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

    const token = jwtSignToken({ email, userId: req.user.id });

    return res.status(200).json({
      data: {
        user: req.user.toClient(),
        accessToken: token,
      },
      message: "Login successfully.",
    });
  } catch (error) {
    next(error);
  }
};
