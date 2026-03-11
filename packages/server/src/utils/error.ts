import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorCode, ErrorResponse } from "shared";

//! General error class
export class AppError extends Error {
  //! The HTTP status code
  public readonly status: number;

  //! The app's internal error code
  public readonly code: ErrorCode;

  constructor(message: string, status: number, code: ErrorCode) {
    super(message);
    this.status = status;
    this.code = code;
  }

  //! Produces the response body from this error
  toResponse(): ErrorResponse {
    return {
      message: this.message,
      code: this.code,
    };
  }

  // Responds to this request using this error code
  respond(resp: Response) {
    return resp.status(this.status).json(this.toResponse());
  }
}

export class UnknownError extends AppError {
  constructor(message?: string) {
    super(
      message || "Unknow error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      "INTERNAL_ERROR",
    );
  }
}

export class RequestValidationError extends AppError {
  constructor(message?: string) {
    super(
      message || "Bad request",
      StatusCodes.BAD_REQUEST,
      "REQUEST_VALIDATION",
    );
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(message?: string) {
    super(message || "Resource not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
  }
}

export class ResourceLockedError extends AppError {
  constructor(message?: string) {
    super(
      message || "Resource is locked",
      StatusCodes.LOCKED,
      "RESOURCE_LOCKED",
    );
  }
}

export class ConflictError extends AppError {
  constructor(message?: string) {
    super(
      message || "Conflicting business logic",
      StatusCodes.CONFLICT,
      "CONFLICT",
    );
  }
}

export class FileSizeError extends AppError {
  constructor() {
    super(
      "File over the allowed size",
      StatusCodes.REQUEST_TOO_LONG,
      "BAD_FILE_SIZE",
    );
  }
}

export class FileTypeError extends AppError {
  constructor() {
    super(
      "File type not allowed",
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      "BAD_FILE_TYPE",
    );
  }
}

export class TimeoutError extends AppError {
  constructor() {
    super("Operation timed out", StatusCodes.GATEWAY_TIMEOUT, "TIMEOUT");
  }
}
