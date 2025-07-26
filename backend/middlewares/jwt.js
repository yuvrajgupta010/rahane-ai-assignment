import JWT from "jsonwebtoken";
import accessControlCenter from "../helpers/accessControlCenter.js";
import CONSTANT from "../helpers/constant.js";

export const authenticateTokenAndAccess = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log(authHeader, "Authorization Header"); // Debugging line

    // Expected format: 'Bearer <token>'
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Access token missing");
      error.status = 401;
      throw error;
    }

    JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        const error = new Error("Invalid or expired token");
        error.status = 403;
        throw error;
      }

      ////////////////////////////////////////
      // check Authorization level
      const requestMethod = req.method;
      const requestPath = req.path;
      let roleIndex;

      if (user?.role === CONSTANT.ROLE_ADMIN) {
        roleIndex = 0;
      } else if (user?.role === CONSTANT.ROLE_EDITOR) {
        roleIndex = 1;
      } else if (user?.role === CONSTANT.ROLE_VIEWER) {
        roleIndex = 2;
      }

      // check access of the user
      const isAuthorizedToAccess =
        accessControlCenter[`${requestMethod} ${requestPath}`][roleIndex];

      if (!isAuthorizedToAccess) {
        const error = new Error("Unauthorized to do this action");
        error.status = 403;
        throw error;
      }
      ////////////////////////////////////////

      req.jwtPayload = user; // Attach payload to request
      // console.log(err, user, "JWT Payload: err, user"); // Debugging line
      next();
    });
  } catch (error) {
    next(error);
  }
};
