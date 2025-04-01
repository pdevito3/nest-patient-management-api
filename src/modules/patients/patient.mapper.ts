import { Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { PatientDto, PatientForCreationDto, PatientForUpdateDto } from './dtos';
import { PatientService } from './patient.service';

@Injectable()
export class PatientMapper {
  constructor(private readonly patientService: PatientService) {}

  mapToDto(patient: Patient): PatientDto {
    const age = this.patientService.getAge(patient);
    const lifeStage = this.patientService.getLifeStage(patient);

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      sex: patient.sex,
      age: age,
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.toISOString()
        : null,
      lifeStage: lifeStage,
    };
  }

  toCreateInput(dto: PatientForCreationDto): Prisma.PatientCreateInput {
    return {
      id: crypto.randomUUID(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      sex: dto.sex,
      knownAge: dto.knownAge || null,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };
  }

  toUpdateInput(dto: PatientForUpdateDto): Prisma.PatientUpdateInput {
    const updateInput: Prisma.PatientUpdateInput = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      sex: dto.sex,
      knownAge: dto.knownAge || null,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };

    return updateInput;
  }
}
