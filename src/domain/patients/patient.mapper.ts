import { Injectable } from '@nestjs/common';
import { PatientDto, PatientForCreationDto, PatientForUpdateDto } from './dtos';
import { PatientForCreation, PatientForUpdate } from './models';
import { Patient } from './patient';

@Injectable()
export class PatientMapper {
  mapToDto(patient: Patient): PatientDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      sex: patient.sex.Value,
      age: patient.lifespan.age,
      dateOfBirth: patient.lifespan.dateOfBirth
        ? patient.lifespan.dateOfBirth.toISOString()
        : null,
      lifeStage: patient.lifespan.getLifeStage(),
    };
  }

  mapToCreationModel(dto: PatientForCreationDto): PatientForCreation {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      sex: dto.sex,
      knownAge: dto.knownAge,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };
  }

  mapToUpdateModel(dto: PatientForUpdateDto): PatientForUpdate {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      sex: dto.sex,
      knownAge: dto.knownAge,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };
  }

  createPatientFromDto(dto: PatientForCreationDto): Patient {
    const model = this.mapToCreationModel(dto);
    return Patient.create(model);
  }

  updatePatientFromDto(patient: Patient, dto: PatientForUpdateDto): Patient {
    const model = this.mapToUpdateModel(dto);
    return patient.update(model);
  }

  /**
   * Maps a domain Patient model to a persistence model for database storage
   * @param patient The domain Patient model
   * @returns The persistence model for database storage
   */
  mapToPersistence(patient: Patient): any {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      sex: patient.sex.Value,
      knownAge: patient.lifespan.knownAge,
      dateOfBirth: patient.lifespan.dateOfBirth,
    };
  }
}
