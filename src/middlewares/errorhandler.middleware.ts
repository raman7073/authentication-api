import { Request, Response, NextFunction } from "express";
import LOGGER from "../utils/logger";

import HttpException from "../utils/exceptions/http.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  LOGGER.error(message, status)

  res.status(status).send({
    status,
    message
  });
}

export default errorMiddleware;

