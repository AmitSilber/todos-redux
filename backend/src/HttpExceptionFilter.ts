import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Request, Response } from 'express';

/**
 * Custom exception filter for handling HTTP exceptions.
 * Extends the BaseExceptionFilter provided by NestJS.
 */
@Catch(Error, HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  /**
   * Method to handle the caught exception.
   * @param exception - The caught exception (Error or HttpException).
   * @param host - The ArgumentsHost object containing the execution context.
   */
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle HttpException instances
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      // Build the error response object
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        request: request.body,
        message: exception.message,
      });
    }
    // Handle other Error instances
    else {
      // Check for specific error message patterns

      // Handle errors related to database relations
      if (exception.message.includes('relation')) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
          request: request.body,
          message: 'relation based error occurred',
        });
      }
      // Handle errors related to database constraints
      else if (exception.message.includes('constrain')) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
          request: request.body,
          message: 'a constraint based error occurred',
        });
      }
      // Handle errors related to request validation
      else if (exception.message.includes('Validation')) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: request.url,
          request: request.body,
          message: exception.message,
        });
      }
    }
  }
}
