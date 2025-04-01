import { Module, Global } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ProblemDetailsConfigService, ProblemDetailsConfigOptions } from './problem-details-config.service';
import { ProblemDetailsExceptionFilter } from './problem-details.filter';

@Global()
@Module({
  controllers: [],
  providers: [
    {
      provide: ProblemDetailsConfigService,
      useFactory: () => {
        // Default configuration - can be customized via module registration
        const options: ProblemDetailsConfigOptions = {
          includeExceptionDetails: process.env.NODE_ENV !== 'production'
        };
        return new ProblemDetailsConfigService(options);
      },
    },
    {
      provide: APP_FILTER,
      useFactory: (problemDetailsConfig: ProblemDetailsConfigService) => {
        return new ProblemDetailsExceptionFilter(problemDetailsConfig);
      },
      inject: [ProblemDetailsConfigService],
    },
  ],
  exports: [ProblemDetailsConfigService],
})
export class ProblemDetailsModule {
  static forRoot(options: ProblemDetailsConfigOptions = {}) {
    return {
      module: ProblemDetailsModule,
      providers: [
        {
          provide: ProblemDetailsConfigService,
          useFactory: () => new ProblemDetailsConfigService(options),
        },
      ],
    };
  }
}
