import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatientDto, PatientForUpdateDto } from '../dtos';
import { PatientMapper } from '../patient.mapper';
import { PrismaService } from '../../prisma/prisma.service';

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
    private readonly prisma: PrismaService,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(command: UpdatePatientCommand): Promise<PatientDto> {
    const updateInput = this.patientMapper.toUpdateInput(command.patientDto);
    
    const patient = await this.prisma.patient.findUnique({
      where: { id: command.id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${command.id} not found`);
    }

    const updatedPatient = await this.prisma.patient.update({
      where: { id: command.id },
      data: updateInput,
    });

    return this.patientMapper.mapToDto(updatedPatient);
  }
}
