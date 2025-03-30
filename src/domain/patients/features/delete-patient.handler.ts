import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatientRepository } from '../patient.repository';

export class DeletePatientCommand {
  constructor(public readonly id: string) {}
}

@Injectable()
@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler
  implements ICommandHandler<DeletePatientCommand>
{
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(command: DeletePatientCommand): Promise<void> {
    const patient = await this.patientRepository.findById(command.id);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${command.id} not found`);
    }

    await this.patientRepository.delete(command.id);
  }
}
