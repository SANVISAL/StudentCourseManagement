import { Request, Response, NextFunction } from "express";
import { BaseCustomError } from "../errors/basecustomerror"; // Adjust path as necessary

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseCustomError) {
    // Handle your custom errors
    const errorResponse = err.getErrorInfo();
    res.status(err.statusCode || 500).json({
      error: {
        message: errorResponse.message,
        statusCode: errorResponse.statusCode,
      },
    });
  } else {
    // Handle unexpected errors
    console.error("Unexpected Error:", err);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  }
  next();
};
