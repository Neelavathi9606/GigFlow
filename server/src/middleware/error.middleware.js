import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    let errors = error.errors || [];

    // Handle common Mongoose / JWT error types gracefully
    if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    } else if (error.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(error.errors || {})
        .map((val) => val.message)
        .join(", ");
    } else if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token. Please log in again.";
    } else if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired. Please log in again.";
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
