import { validationResult } from "express-validator";

const expressValidation = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 422;
    throw error;
  }
};

export default expressValidation;
