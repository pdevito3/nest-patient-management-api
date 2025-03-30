import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatientDto, PatientForCreationDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PatientRepository } from '../patient.repository';

export class CreatePatientCommand {
  constructor(public readonly patientDto: PatientForCreationDto) {}
}

@Injectable()
@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler
  implements ICommandHandler<CreatePatientCommand>
{
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(command: CreatePatientCommand): Promise<PatientDto> {
    const patientData = this.patientMapper.mapToCreationModel(
      command.patientDto,
    );
    const patient = await this.patientRepository.create(patientData);
    return this.patientMapper.mapToDto(patient);
  }
}
