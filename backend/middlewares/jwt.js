import JWT from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader, "Authorization Header"); // Debugging line

  // Expected format: 'Bearer <token>'
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("Access token missing");
    error.status = 401;
    return next(error);
  }

  JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      const error = new Error("Invalid or expired token");
      error.status = 403;
      next(error);
    }
    req.jwtPayload = user; // Attach payload to request
    // console.log(err, user, "JWT Payload: err, user"); // Debugging line
    next();
  });
};
