import { SexService, SexEnum } from './sex.service';

describe('SexService', () => {
  let sexService: SexService;

  beforeEach(() => {
    sexService = new SexService();
  });

  describe('default_to_not_given', () => {
    it.each([['gibberish'], [null], [undefined], [''], ['   ']])(
      'should default to Not Given for input %s',
      (input) => {
        // Arrange & Act
        const sexValue = sexService.parseValue(input as string);

        // Assert
        expect(sexValue).toBe('Not Given');
      },
    );
  });

  describe('can_transform_for_male', () => {
    it.each([['m'], ['M'], ['Male'], ['MALE'], ['male'], ['  male  ']])(
      'should transform %s to Male',
      (input) => {
        // Arrange & Act
        const sexValue = sexService.parseValue(input);

        // Assert
        expect(sexValue).toBe('Male');
        expect(sexService.isMale(sexValue)).toBe(true);
        expect(sexService.isFemale(sexValue)).toBe(false);
        expect(sexService.isUnknown(sexValue)).toBe(false);
      },
    );
  });

  describe('can_transform_for_female', () => {
    it.each([['f'], ['F'], ['Female'], ['FEMALE'], ['female'], ['  female  ']])(
      'should transform %s to Female',
      (input) => {
        // Arrange & Act
        const sexValue = sexService.parseValue(input);

        // Assert
        expect(sexValue).toBe('Female');
        expect(sexService.isFemale(sexValue)).toBe(true);
        expect(sexService.isMale(sexValue)).toBe(false);
        expect(sexService.isUnknown(sexValue)).toBe(false);
      },
    );
  });

  describe('service_methods', () => {
    it('should return Unknown sex value', () => {
      // Arrange & Act
      const sexValue = sexService.getUnknown();

      // Assert
      expect(sexValue).toBe('Unknown');
      expect(sexService.isUnknown(sexValue)).toBe(true);
      expect(sexService.isMale(sexValue)).toBe(false);
      expect(sexService.isFemale(sexValue)).toBe(false);
    });

    it('should return Male sex value', () => {
      // Arrange & Act
      const sexValue = sexService.getMale();

      // Assert
      expect(sexValue).toBe('Male');
      expect(sexService.isMale(sexValue)).toBe(true);
      expect(sexService.isFemale(sexValue)).toBe(false);
      expect(sexService.isUnknown(sexValue)).toBe(false);
    });

    it('should return Female sex value', () => {
      // Arrange & Act
      const sexValue = sexService.getFemale();

      // Assert
      expect(sexValue).toBe('Female');
      expect(sexService.isFemale(sexValue)).toBe(true);
      expect(sexService.isMale(sexValue)).toBe(false);
      expect(sexService.isUnknown(sexValue)).toBe(false);
    });

    it('should return Not Given sex value', () => {
      // Arrange & Act
      const sexValue = sexService.getNotGiven();

      // Assert
      expect(sexValue).toBe('Not Given');
      expect(sexService.isFemale(sexValue)).toBe(false);
      expect(sexService.isMale(sexValue)).toBe(false);
      expect(sexService.isUnknown(sexValue)).toBe(false);
    });
  });

  describe('list_values', () => {
    it('should return all sex enum values', () => {
      // Arrange & Act
      const values = sexService.listAllValues();

      // Assert
      expect(values).toContain('Unknown');
      expect(values).toContain('Male');
      expect(values).toContain('Female');
      expect(values).toContain('Not Given');
      expect(values.length).toBe(4);
    });
  });
});
