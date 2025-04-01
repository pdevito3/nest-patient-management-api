import { ValidationException } from '../shared/exceptions/validation-exception';
import { LifespanService } from './lifespan.service';

describe('LifespanService', () => {
  let lifespanService: LifespanService;

  beforeEach(() => {
    lifespanService = new LifespanService();
  });

  describe('can_get_lifespan_from_date_of_birth', () => {
    it.each([
      [-18, 0],
      [-2250, 6],
      [-364, 0],
      [-0, 0],
    ])(
      'should calculate correct age for date %i days old',
      (daysOld, expectedAge) => {
        // Arrange
        const now = new Date();
        const dob = new Date(now);
        dob.setDate(dob.getDate() + daysOld);

        // Act
        const lifespan = lifespanService.createFromDateOfBirth(dob);
        const age = lifespanService.getAge(null, dob);
        const ageInDays = lifespanService.getAgeInDays(dob);

        // Assert
        expect(lifespan.dateOfBirth).toEqual(dob);
        expect(lifespan.knownAge).toBeNull();
        expect(age).toBe(expectedAge);
        expect(ageInDays).toBe(daysOld * -1);
      },
    );
  });

  describe('can_get_lifespan_from_age', () => {
    it.each([
      [0, 0],
      [6, 6],
      [1, 1],
    ])('should set correct age for known age %i', (inputAge, expectedAge) => {
      // Arrange & Act
      const lifespan = lifespanService.createFromKnownAge(inputAge);
      const age = lifespanService.getAge(inputAge, null);
      const ageInDays = lifespanService.getAgeInDays(null);

      // Assert
      expect(lifespan.knownAge).toBe(expectedAge);
      expect(lifespan.dateOfBirth).toBeNull();
      expect(age).toBe(expectedAge);
      expect(ageInDays).toBeNull();
    });
  });

  describe('validation', () => {
    it('should throw exception for negative age', () => {
      // Arrange & Act & Assert
      expect(() => {
        lifespanService.createFromKnownAge(-1);
      }).toThrow(ValidationException);
    });

    it('should throw exception for age over 120', () => {
      // Arrange & Act & Assert
      expect(() => {
        lifespanService.createFromKnownAge(121);
      }).toThrow(ValidationException);
    });

    it('should throw exception for future date of birth', () => {
      // Arrange
      const futureDob = new Date();
      futureDob.setDate(futureDob.getDate() + 1);

      // Act & Assert
      expect(() => {
        lifespanService.createFromDateOfBirth(futureDob);
      }).toThrow(ValidationException);
    });
  });

  describe('life_stage', () => {
    it.each([
      [null, null, 'Unknown'],
      [0, null, 'Infant'],
      [0.5, null, 'Infant'],
      [1, null, 'Toddler'],
      [2, null, 'Toddler'],
      [3, null, 'Child'],
      [12, null, 'Child'],
      [13, null, 'Adolescent'],
      [17, null, 'Adolescent'],
      [18, null, 'Adult'],
      [64, null, 'Adult'],
      [65, null, 'Senior'],
      [90, null, 'Senior'],
    ])('should return correct life stage for age %s', (age, dob, expectedStage) => {
      // Arrange & Act
      const lifeStage = lifespanService.getLifeStage(age, dob);

      // Assert
      expect(lifeStage).toBe(expectedStage);
    });
  });
});
