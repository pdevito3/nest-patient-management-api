import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PatientsModule } from './modules/patients/patients.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProblemDetailsModule } from './modules/shared/problem-details/problem-details.module';

@Module({
  imports: [
    PatientsModule, 
    CqrsModule.forRoot(), 
    PrismaModule,
    ProblemDetailsModule.forRoot({
      includeExceptionDetails: process.env.NODE_ENV !== 'production'
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
