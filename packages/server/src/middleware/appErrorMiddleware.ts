import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.js";

//! Middleware to handle generic errors
export const appErrorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if an instance of our app's error implementation
  if (err instanceof AppError) {
    return err.respond(res);
  }

  // Fallback to next error handler
  next(err);
};
