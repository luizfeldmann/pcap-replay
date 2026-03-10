import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";

interface HttpError extends Error {
  status?: number;
}

function isHttpError(err: unknown): err is HttpError {
  return typeof err === "object" && err !== null && "status" in err;
}

export const spaFallbackMiddleware =
  (apiPrefix: string, publicDir: string) =>
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Only handle 404 errors for non-API routes
    if (
      isHttpError(err) &&
      err.status === StatusCodes.NOT_FOUND &&
      !req.path.startsWith(apiPrefix)
    ) {
      return res.sendFile(path.join(publicDir, "index.html"), (err) => {
        if (err) next(err);
      });
    }

    // Otherwise fallback to regular middlewares
    next(err);
  };
