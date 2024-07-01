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
