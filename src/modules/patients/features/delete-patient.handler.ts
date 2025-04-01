import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';

export class DeletePatientCommand {
  constructor(public readonly id: string) {}
}

@Injectable()
@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler
  implements ICommandHandler<DeletePatientCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeletePatientCommand): Promise<void> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: command.id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${command.id} not found`);
    }

    try {
      await this.prisma.patient.delete({
        where: { id: command.id },
      });
    } catch (error) {
      throw new Error(`Failed to delete patient with ID ${command.id}`);
    }
  }
}
