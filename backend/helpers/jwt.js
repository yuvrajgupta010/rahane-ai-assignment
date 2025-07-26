import JWT from "jsonwebtoken";

export const jwtSignToken = (jwtPayloadData) => {
  return JWT.sign(jwtPayloadData, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
