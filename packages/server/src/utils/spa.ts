import { NextFunction, Request, Response } from "express";
import path from "path";

export const spaFallbackMiddleware =
  (apiPrefix: string, publicDir: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Do not handle API calls
    if (!req.path.startsWith(apiPrefix)) {
      return res.sendFile(path.join(publicDir, "index.html"));
    }

    // Otherwise fallback to regular middlewares
    next();
  };
