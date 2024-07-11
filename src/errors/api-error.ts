import { StatusCode } from "../utils/const/status-code";
import { BaseCustomError } from "./basecustomerror";

export class ApiError extends BaseCustomError {
  constructor(
    message: string,
    statusCode: number = StatusCode.InternalServerError
  ) {
    super(message, statusCode);

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message = "Resource Not Found",
    statusCode: number = StatusCode.NotFound
  ) {
    super(message, statusCode);
  }
}

export class MissingReqirement extends ApiError {
  constructor(
    message = "Missing Requestirement",
    statusCode: number = StatusCode.NotAcceptable
  ) {
    super(message, statusCode);
  }
}