import { NextFunction, Request, Response } from "express";
import { SqliteError } from "better-sqlite3";
import { ResourceLockedError } from "../utils/error.js";

//! Middleware to handle SQL errors
export const sqlErrorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if SQL error
  if (err instanceof SqliteError) {
    switch (err.code) {
      // Trying to delete an row referenced by another table
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
      case "SQLITE_CONSTRAINT_TRIGGER":
        next(new ResourceLockedError());
        break;
    }
  }

  // Fallback to the next error middleware
  next(err);
};
