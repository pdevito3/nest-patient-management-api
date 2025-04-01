import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatientDto, PatientForCreationDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PrismaService } from '../../prisma/prisma.service';

export class CreatePatientCommand {
  constructor(public readonly patientDto: PatientForCreationDto) {}
}

@Injectable()
@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler
  implements ICommandHandler<CreatePatientCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(command: CreatePatientCommand): Promise<PatientDto> {
    const createInput = this.patientMapper.toCreateInput(command.patientDto);
    const patient = await this.prisma.patient.create({
      data: createInput,
    });
    return this.patientMapper.mapToDto(patient);
  }
}
