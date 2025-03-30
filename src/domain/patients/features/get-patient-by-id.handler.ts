import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PatientDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PatientRepository } from '../patient.repository';

export class GetPatientByIdQuery {
  constructor(public readonly id: string) {}
}

@Injectable()
@QueryHandler(GetPatientByIdQuery)
export class GetPatientByIdHandler
  implements IQueryHandler<GetPatientByIdQuery>
{
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(query: GetPatientByIdQuery): Promise<PatientDto> {
    const patient = await this.patientRepository.findById(query.id);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${query.id} not found`);
    }

    return this.patientMapper.mapToDto(patient);
  }
}
