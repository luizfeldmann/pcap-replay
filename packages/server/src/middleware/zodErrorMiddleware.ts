import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { RequestValidationError } from "../utils/error.js";

//! Middleware to handle ZOD validations
export const zodErrorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) next(new RequestValidationError(err.message));
  else next(err);
};
