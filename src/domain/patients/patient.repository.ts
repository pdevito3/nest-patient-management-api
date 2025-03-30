import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientForCreation, PatientForUpdate } from './models';
import { Patient } from './patient';

@Injectable()
export class PatientRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Patient[]> {
    const patients = await this.prisma.patient.findMany();
    return patients.map((patientData) => this.mapToDomain(patientData));
  }

  async findById(id: string): Promise<Patient | undefined> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return undefined;
    }

    return this.mapToDomain(patient);
  }

  async create(patientData: PatientForCreation): Promise<Patient> {
    const domainPatient = Patient.create(patientData);

    await this.prisma.patient.create({
      data: {
        id: domainPatient.id,
        firstName: domainPatient.firstName,
        lastName: domainPatient.lastName,
        sex: domainPatient.sex.Value,
        knownAge: domainPatient.lifespan.knownAge,
        dateOfBirth: domainPatient.lifespan.dateOfBirth,
      },
    });

    return domainPatient;
  }

  async update(
    id: string,
    patientData: PatientForUpdate,
  ): Promise<Patient | undefined> {
    const existingPatient = await this.findById(id);

    if (!existingPatient) {
      return undefined;
    }

    const updatedDomainPatient = existingPatient.update(patientData);

    await this.prisma.patient.update({
      where: { id },
      data: {
        firstName: updatedDomainPatient.firstName,
        lastName: updatedDomainPatient.lastName,
        sex: updatedDomainPatient.sex.Value,
        knownAge: updatedDomainPatient.lifespan.knownAge,
        dateOfBirth: updatedDomainPatient.lifespan.dateOfBirth,
      },
    });

    return updatedDomainPatient;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.patient.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToDomain(patientData: any): Patient {
    return Patient.create({
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      sex: patientData.sex,
      knownAge: patientData.knownAge,
      dateOfBirth: patientData.dateOfBirth,
    });
  }
}
