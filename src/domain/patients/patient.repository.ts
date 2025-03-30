import { Injectable } from '@nestjs/common';
import { PatientForCreation, PatientForUpdate } from './models';
import { Patient } from './patient';

@Injectable()
export class PatientRepository {
  private patients: Map<string, Patient> = new Map<string, Patient>();

  async findAll(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async findById(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async create(patientData: PatientForCreation): Promise<Patient> {
    const patient = Patient.create(patientData);
    this.patients.set(patient.id, patient);
    return patient;
  }

  async update(
    id: string,
    patientData: PatientForUpdate,
  ): Promise<Patient | undefined> {
    const existingPatient = this.patients.get(id);

    if (!existingPatient) {
      return undefined;
    }

    const updatedPatient = existingPatient.update(patientData);
    this.patients.set(id, updatedPatient);

    return updatedPatient;
  }

  async delete(id: string): Promise<boolean> {
    return this.patients.delete(id);
  }
}
