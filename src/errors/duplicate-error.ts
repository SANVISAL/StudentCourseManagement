import { StatusCode } from "../utils/const/status-code";
import { BaseCustomError } from "./basecustomerror";

export default class DuplicateError extends BaseCustomError {
  constructor(message: string) {
    super(message, StatusCode.Conflict);

    Object.setPrototypeOf(this, DuplicateError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }
 
}