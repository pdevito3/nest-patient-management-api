import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PatientMapper } from './patient.mapper';
import { PatientRepository } from './patient.repository';
import { PatientsController } from './patients.controller.v1';
import { PrismaModule } from '../../prisma/prisma.module';

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
  providers: [PatientRepository, PatientMapper, ...CommandHandlers],
  exports: [PatientRepository, PatientMapper],
})
export class PatientsModule {}
