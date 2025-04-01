import { Injectable } from '@nestjs/common';
import { Patient as PrismaPatient } from '@prisma/client';
import { SexService } from 'src/modules/sexes/sex.service';
import { LifespanService } from 'src/modules/lifespans/lifespan.service';
import { PatientForCreation, PatientForUpdate } from './models';

@Injectable()
export class PatientService {
  constructor(
    private readonly sexService: SexService,
    private readonly lifespanService: LifespanService,
  ) {}

  public create(patientForCreation: PatientForCreation): PrismaPatient {
    const sexValue = this.sexService.create(patientForCreation.sex);
    const lifespan = this.lifespanService.create(
      patientForCreation.knownAge,
      patientForCreation.dateOfBirth
    );

    return {
      id: crypto.randomUUID(),
      firstName: patientForCreation.firstName,
      lastName: patientForCreation.lastName,
      sex: sexValue,
      knownAge: lifespan.knownAge,
      dateOfBirth: lifespan.dateOfBirth,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public update(patient: PrismaPatient, patientForUpdate: PatientForUpdate): PrismaPatient {
    const sexValue = this.sexService.create(patientForUpdate.sex);
    const lifespan = this.lifespanService.create(
      patientForUpdate.knownAge,
      patientForUpdate.dateOfBirth
    );

    return {
      ...patient,
      firstName: patientForUpdate.firstName,
      lastName: patientForUpdate.lastName,
      sex: sexValue,
      knownAge: lifespan.knownAge,
      dateOfBirth: lifespan.dateOfBirth,
      updatedAt: new Date(),
    };
  }

  public getAge(patient: PrismaPatient): number | null {
    return this.lifespanService.getAge(patient.knownAge, patient.dateOfBirth);
  }

  public getLifeStage(patient: PrismaPatient): string {
    return this.lifespanService.getLifeStage(patient.knownAge, patient.dateOfBirth);
  }

  public isFemale(patient: PrismaPatient): boolean {
    return this.sexService.isFemale(patient.sex);
  }

  public isMale(patient: PrismaPatient): boolean {
    return this.sexService.isMale(patient.sex);
  }
}
