import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProblemDetailsConfigService } from './problem-details-config.service';

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsExceptionFilter.name);

  constructor(private readonly problemDetailsConfig: ProblemDetailsConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // If headers are already sent, we can't send a response
    if (response.headersSent) {
      return;
    }

    try {
      // Check if the exception should be ignored or rethrown
      if (this.problemDetailsConfig.shouldIgnore(exception)) {
        throw exception;
      }

      if (this.problemDetailsConfig.shouldRethrow(exception)) {
        throw exception;
      }

      const problemDetails = this.problemDetailsConfig.createProblemDetails(exception, request);
      
      if (!problemDetails) {
        throw exception;
      }

      const status = problemDetails.status || 
        (exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR);

      this.logger.error({ 
        exception, 
        path: request.path, 
        method: request.method,
        status
      }, 'Request error');

      response.status(status).json(problemDetails);
    } catch (error) {
      // If something goes wrong in our error handling, log it and rethrow
      this.logger.error({ error }, 'Error in problem details filter');
      throw exception;
    }
  }
}
