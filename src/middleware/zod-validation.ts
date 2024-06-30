import { BaseCustomError } from "../errors/basecustomerror";
import { StatusCode } from "../utils/const/status-code";
import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";

/**
 * Middleware to validate request body against a Zod schema.
 * @param schema Zod schema object to validate request body.
 * @returns Express middleware function.
 */
export const zodValidator = (schema: Schema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => {
          return `${issue.path.join(".")} ${issue.message}`;
        });
        return next(
          new BaseCustomError(
            `${errorMessages}`,
            StatusCode.UnprocessableEntity
          )
        );
      }
      //   return next(new ApiError("Internal server error"));
    }
  };
};
