import { Injectable } from '@nestjs/common';

/**
 * Enum representing the possible sex values
 */
export enum SexEnum {
  Unknown = 'Unknown',
  Male = 'Male',
  Female = 'Female',
  NotGiven = 'Not Given'
}

@Injectable()
export class SexService {
  /**
   * Creates a sex value from the provided input
   * @param value The input value
   * @returns The parsed sex value
   */
  create(value?: string | null): string {
    if (value === undefined || value === null) {
      return SexEnum.NotGiven;
    } else {
      return this.parseValue(value);
    }
  }

  parseValue(value?: string | null): string {
    if (!value || value.trim() === '') {
      return SexEnum.NotGiven;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.toLowerCase() === 'm') {
      return SexEnum.Male;
    }

    if (trimmedValue.toLowerCase() === 'f') {
      return SexEnum.Female;
    }

    const normalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    
    if (Object.values(SexEnum).includes(normalizedValue as SexEnum)) {
      return normalizedValue;
    }

    return SexEnum.NotGiven;
  }

  isFemale(value: string): boolean {
    return value === SexEnum.Female;
  }

  isMale(value: string): boolean {
    return value === SexEnum.Male;
  }

  isUnknown(value: string): boolean {
    return value === SexEnum.Unknown;
  }

  listAllValues(): string[] {
    return Object.values(SexEnum);
  }

  getUnknown(): string {
    return SexEnum.Unknown;
  }

  getMale(): string {
    return SexEnum.Male;
  }

  getFemale(): string {
    return SexEnum.Female;
  }

  getNotGiven(): string {
    return SexEnum.NotGiven;
  }
}
