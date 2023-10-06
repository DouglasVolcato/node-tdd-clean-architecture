import { HashValidatorInterface } from "../../../../src/domain/abstract";

export class HashValidatorStub implements HashValidatorInterface {
  public validate(value: string, hashedValue: string): boolean {
    return true;
  }
}
