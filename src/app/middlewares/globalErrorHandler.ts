/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong';
  let errorMessage: string | string[] = 'Error Occurred';
  if (err instanceof ZodError) {
    statusCode = 404;
    message = 'Validation Error';
    errorMessage = err.issues.map((issue) => issue.message);
  } else if (err?.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorMessage = err.message;
  } else if (err?.errorResponse?.code === 11000) {
    statusCode = 400;
    message = 'Unique Identifier';
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    errorMessage = `${extractedMessage} is already exists`;
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    errorMessage = `${extractedMessage} is not a valid ID`;
  } else if (err instanceof Error) {
    message = err.message;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err,
    stack: err?.stack,
  });
};
export default globalErrorHandler;
