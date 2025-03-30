import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PatientDto, PatientForCreationDto, PatientForUpdateDto } from './dtos';
import { CreatePatientCommand } from './features/create-patient.handler';
import { DeletePatientCommand } from './features/delete-patient.handler';
import { GetAllPatientsQuery } from './features/get-all-patients.handler';
import { GetPatientByIdQuery } from './features/get-patient-by-id.handler';
import { UpdatePatientCommand } from './features/update-patient.handler';

@Controller({
  path: 'patients',
  version: '1',
})
export class PatientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllPatients(): Promise<PatientDto[]> {
    return this.queryBus.execute(new GetAllPatientsQuery());
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string): Promise<PatientDto> {
    return this.queryBus.execute(new GetPatientByIdQuery(id));
  }

  @Post()
  async createPatient(
    @Body() patientDto: PatientForCreationDto,
  ): Promise<PatientDto> {
    return this.commandBus.execute(new CreatePatientCommand(patientDto));
  }

  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() patientDto: PatientForUpdateDto,
  ): Promise<PatientDto> {
    return this.commandBus.execute(new UpdatePatientCommand(id, patientDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePatient(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePatientCommand(id));
  }
}
