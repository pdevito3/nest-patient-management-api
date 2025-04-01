import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException as NestNotFoundException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProblemDetailsConfigService } from './problem-details-config.service';
import { NotFoundException } from '../exceptions/not-found-exception';

@Catch(NestNotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundExceptionFilter.name);

  constructor(private readonly problemDetailsConfig: ProblemDetailsConfigService) {}

  catch(exception: NestNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // If headers are already sent, we can't send a response
    if (response.headersSent) {
      return;
    }

    try {
      // Create a not found problem details response
      const notFoundError = new NotFoundException(`Route '${request.path}' not found`);
      const problemDetails = this.problemDetailsConfig.createProblemDetails(notFoundError, request);
      
      if (!problemDetails) {
        throw exception;
      }

      this.logger.warn({ 
        path: request.path, 
        method: request.method,
        status: 404
      }, 'Route not found');

      response.status(404).json(problemDetails);
    } catch (error) {
      // If something goes wrong in our error handling, log it and rethrow
      this.logger.error({ error }, 'Error in not found filter');
      throw exception;
    }
  }
}
