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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Patients')
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
  @ApiOperation({ summary: 'Get all patients', description: 'Retrieves a list of all patients' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of patients retrieved successfully',
    type: [PatientDto]
  })
  async getAllPatients(): Promise<PatientDto[]> {
    return this.queryBus.execute(new GetAllPatientsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID', description: 'Retrieves a patient by their unique identifier' })
  @ApiParam({ name: 'id', description: 'Patient ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Patient retrieved successfully',
    type: PatientDto
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientById(@Param('id') id: string): Promise<PatientDto> {
    return this.queryBus.execute(new GetPatientByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create patient', description: 'Creates a new patient record' })
  @ApiBody({ type: PatientForCreationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Patient created successfully',
    type: PatientDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createPatient(
    @Body() patientDto: PatientForCreationDto,
  ): Promise<PatientDto> {
    return this.commandBus.execute(new CreatePatientCommand(patientDto));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient', description: 'Updates an existing patient record' })
  @ApiParam({ name: 'id', description: 'Patient ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: PatientForUpdateDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Patient updated successfully',
    type: PatientDto
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updatePatient(
    @Param('id') id: string,
    @Body() patientDto: PatientForUpdateDto,
  ): Promise<PatientDto> {
    return this.commandBus.execute(new UpdatePatientCommand(id, patientDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete patient', description: 'Deletes a patient record' })
  @ApiParam({ name: 'id', description: 'Patient ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async deletePatient(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePatientCommand(id));
  }
}
