import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PatientDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PatientRepository } from '../patient.repository';

export class GetAllPatientsQuery {
  constructor() {}
}

@Injectable()
@QueryHandler(GetAllPatientsQuery)
export class GetAllPatientsHandler
  implements IQueryHandler<GetAllPatientsQuery>
{
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(query: GetAllPatientsQuery): Promise<PatientDto[]> {
    const patients = await this.patientRepository.findAll();
    return patients.map((patient) => this.patientMapper.mapToDto(patient));
  }
}
