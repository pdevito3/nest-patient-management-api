import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatientDto, PatientForUpdateDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PatientRepository } from '../patient.repository';

export class UpdatePatientCommand {
  constructor(
    public readonly id: string,
    public readonly patientDto: PatientForUpdateDto,
  ) {}
}

@Injectable()
@CommandHandler(UpdatePatientCommand)
export class UpdatePatientHandler
  implements ICommandHandler<UpdatePatientCommand>
{
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(command: UpdatePatientCommand): Promise<PatientDto> {
    const patientData = this.patientMapper.mapToUpdateModel(command.patientDto);

    const patient = await this.patientRepository.update(
      command.id,
      patientData,
    );

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${command.id} not found`);
    }

    return this.patientMapper.mapToDto(patient);
  }
}
