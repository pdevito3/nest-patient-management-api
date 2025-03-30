import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './domain/patients/patients.module';

@Module({
  imports: [PatientsModule, CqrsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
