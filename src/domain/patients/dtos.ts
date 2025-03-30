import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatientForCreationDto {
  @ApiProperty({ description: 'Patient first name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Patient last name', example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ description: 'Patient sex', example: 'M', enum: ['M', 'F', 'O'] })
  sex?: string;

  @ApiPropertyOptional({ description: 'Known age of the patient', example: 35, nullable: true })
  knownAge?: number | null;

  @ApiPropertyOptional({ 
    description: 'Patient date of birth in ISO format', 
    example: '1988-01-15', 
    nullable: true 
  })
  dateOfBirth?: string | null;
}

export class PatientForUpdateDto {
  @ApiProperty({ description: 'Patient first name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Patient last name', example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ description: 'Patient sex', example: 'M', enum: ['M', 'F', 'O'] })
  sex?: string;

  @ApiPropertyOptional({ description: 'Known age of the patient', example: 35, nullable: true })
  knownAge?: number | null;

  @ApiPropertyOptional({ 
    description: 'Patient date of birth in ISO format', 
    example: '1988-01-15', 
    nullable: true 
  })
  dateOfBirth?: string | null;
}

export class PatientDto {
  @ApiProperty({ description: 'Unique patient identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Patient first name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Patient last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Patient sex', example: 'M', enum: ['M', 'F', 'O'] })
  sex: string;

  @ApiProperty({ description: 'Age of the patient', example: 35, nullable: true })
  age: number | null;

  @ApiProperty({ 
    description: 'Patient date of birth in ISO format', 
    example: '1988-01-15', 
    nullable: true 
  })
  dateOfBirth: string | null;

  @ApiProperty({ 
    description: 'Life stage of the patient', 
    example: 'Adult',
    enum: ['Infant', 'Child', 'Adolescent', 'Adult', 'Elderly'] 
  })
  lifeStage: string;
}
