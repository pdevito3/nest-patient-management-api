import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PatientDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PrismaService } from '../../prisma/prisma.service';

export class GetPatientByIdQuery {
  constructor(public readonly id: string) {}
}

@Injectable()
@QueryHandler(GetPatientByIdQuery)
export class GetPatientByIdHandler
  implements IQueryHandler<GetPatientByIdQuery>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(query: GetPatientByIdQuery): Promise<PatientDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: query.id },
    });

    if (patient === null || patient === undefined) {
      throw new NotFoundException(`Patient with ID ${query.id} not found`);
    }

    return this.patientMapper.mapToDto(patient);
  }
}
