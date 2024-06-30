export class BaseCustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseCustomError.prototype);
  }

  // Method to get error information
  getErrorInfo() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
