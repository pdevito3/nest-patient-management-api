import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './domain/patients/patients.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProblemDetailsModule } from './common/problem-details/problem-details.module';

@Module({
  imports: [
    PatientsModule, 
    CqrsModule.forRoot(), 
    PrismaModule,
    ProblemDetailsModule.forRoot({
      includeExceptionDetails: process.env.NODE_ENV !== 'production'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
