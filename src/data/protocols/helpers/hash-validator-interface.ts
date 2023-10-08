export interface HashValidatorInterface {
  validate(value: string, hashedValue: string): boolean;
}
