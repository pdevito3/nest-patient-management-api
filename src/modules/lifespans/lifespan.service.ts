import { Injectable } from '@nestjs/common';
import { ValidationException } from '../shared/exceptions/validation-exception';


@Injectable()
export class LifespanService {
  /**
   * Creates a lifespan representation based on provided age or date of birth
   * @param knownAge Known age in years
   * @param dateOfBirth Date of birth
   * @returns A lifespan object with either knownAge or dateOfBirth
   */
  create(
    knownAge?: number | string | null,
    dateOfBirth?: Date | string | null,
  ): { knownAge: number | null; dateOfBirth: Date | null } {
    let resultKnownAge: number | null = null;
    let resultDateOfBirth: Date | null = null;

    const hasAge = knownAge !== undefined && knownAge !== null;
    const hasDob = dateOfBirth !== undefined && dateOfBirth !== null;

    if (hasAge && !hasDob) {
      const age =
        typeof knownAge === 'string' ? parseInt(knownAge, 10) : knownAge;
      if (!isNaN(age)) {
        const result = this.createFromKnownAge(age);
        resultKnownAge = result.knownAge;
      }
    }

    if (hasDob) {
      const dob =
        typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;

      if (dob instanceof Date && !isNaN(dob.getTime())) {
        const result = this.createFromDateOfBirth(dob);
        resultDateOfBirth = result.dateOfBirth;
      }
    }

    return { knownAge: resultKnownAge, dateOfBirth: resultDateOfBirth };
  }

  /**
   * Creates a lifespan representation from known age
   * @param ageInYears Age in years
   * @throws ValidationException if age is invalid
   */
  createFromKnownAge(ageInYears: number): { knownAge: number; dateOfBirth: null } {
    if (ageInYears < 0) {
      throw new ValidationException(
        'Lifespan',
        'Age cannot be less than zero years.',
      );
    }

    if (ageInYears > 120) {
      throw new ValidationException(
        'Lifespan',
        'Age cannot be more than 120 years.',
      );
    }

    return { knownAge: ageInYears, dateOfBirth: null };
  }

  /**
   * Creates a lifespan representation from date of birth
   * @param dob Date of birth
   * @throws ValidationException if date of birth is invalid
   */
  createFromDateOfBirth(dob: Date): { knownAge: null; dateOfBirth: Date } {
    if (dob > new Date()) {
      throw new ValidationException(
        'Lifespan',
        'Date of birth must be in the past',
      );
    }

    return { knownAge: null, dateOfBirth: dob };
  }

  /**
   * Gets the age in years, calculated from either known age or date of birth
   * @param knownAge Known age in years
   * @param dateOfBirth Date of birth
   * @returns Age in years or null if neither is available
   */
  getAge(knownAge: number | null, dateOfBirth: Date | null): number | null {
    if (knownAge !== null) {
      return knownAge;
    }

    if (dateOfBirth !== null) {
      return this.getAgeInYears(dateOfBirth);
    }

    return null;
  }

  /**
   * Gets the age in days, calculated from date of birth
   * @param dateOfBirth Date of birth
   * @returns Age in days or null if date of birth is not set
   */
  getAgeInDays(dateOfBirth: Date | null): number | null {
    if (dateOfBirth !== null) {
      return this.calculateAgeInDays(dateOfBirth);
    }

    return null;
  }

  /**
   * Gets the life stage for the person
   * @param knownAge Known age in years
   * @param dateOfBirth Date of birth
   * @returns A string representing the life stage
   */
  getLifeStage(knownAge: number | null, dateOfBirth: Date | null): string {
    const age = this.getAge(knownAge, dateOfBirth);

    if (age === null) {
      return 'Unknown';
    }

    if (age < 1) {
      return 'Infant';
    }

    if (age < 3) {
      return 'Toddler';
    }

    if (age < 13) {
      return 'Child';
    }

    if (age < 18) {
      return 'Adolescent';
    }

    if (age < 65) {
      return 'Adult';
    }

    return 'Senior';
  }

  /**
   * Calculates age in years from a date of birth
   * @param dob Date of birth
   * @returns Age in years
   */
  private getAgeInYears(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Calculates age in days from a date of birth
   * @param dob Date of birth
   * @returns Age in days
   */
  private calculateAgeInDays(dob: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const dobUtc = new Date(
      Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate()),
    );
    const nowUtc = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
    );

    return Math.floor((nowUtc.getTime() - dobUtc.getTime()) / msPerDay);
  }
}
