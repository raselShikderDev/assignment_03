import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'An unexpected server error occurred.';
  let errorDetail: any = {};

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Invalid input data';
    errorDetail = {
      name: "ZodValidationError",
      errors: err.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))
    };
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    const errors: { [key: string]: any } = {};
    for (const key in err.errors) {
      const individualError = err.errors[key];
      errors[key] = {
        message: individualError.message,
        name: individualError.name,
        kind: individualError.kind,
        path: individualError.path,
        value: individualError.value
      };
      if (individualError instanceof mongoose.Error.ValidatorError) {
        errors[key].properties = individualError.properties;
      }
    }
    errorDetail = { name: "MongooseValidationError", errors: errors };
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid input: ID format is incorrect';
    errorDetail = {
      name: "CastError",
      message: `Invalid format for parameter '${err.path}': '${err.value}' is not a valid ID.`,
      path: err.path,
      value: err.value
    };
  } else if (err.code === 11000 && err.keyPattern) {
    statusCode = 409;
    message = 'Input conflict: A resource with this key already exists.';
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue ? err.keyValue[field] : 'unknown';
    errorDetail = {
      name: "DuplicateKeyError",
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists.`,
      value: value
    };
  } else {
    errorDetail = {
      name: err.name || "ServerError",
      message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong on our end.",
    };
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetail,
  });
};

export default globalErrorHandler;