import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientMapper } from './patient.mapper';
import { PatientsController } from './patients.controller.v1';
import { PatientService } from './patient.service';
import { SexService } from '../sexes/sex.service';
import { LifespanService } from '../lifespans/lifespan.service';

import { CreatePatientHandler } from './features/create-patient.handler';
import { DeletePatientHandler } from './features/delete-patient.handler';
import { GetAllPatientsHandler } from './features/get-all-patients.handler';
import { GetPatientByIdHandler } from './features/get-patient-by-id.handler';
import { UpdatePatientHandler } from './features/update-patient.handler';

const CommandHandlers = [
  GetAllPatientsHandler,
  GetPatientByIdHandler,
  CreatePatientHandler,
  UpdatePatientHandler,
  DeletePatientHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [PatientsController],
  providers: [
    PatientMapper, 
    PatientService,
    SexService,
    LifespanService,
    ...CommandHandlers
  ],
  exports: [PatientMapper, PatientService],
})
export class PatientsModule {}
