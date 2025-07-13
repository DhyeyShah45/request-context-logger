import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { RequestLogger } from "./logger";
import { initContext } from "./storage";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers["x-request-id"]?.toString() || uuidv4();
  const logger = new RequestLogger(requestId, req);

  initContext(logger, () => {
    res.on("finish", () => {
      logger.flush();
    });
    next();
  });
}
