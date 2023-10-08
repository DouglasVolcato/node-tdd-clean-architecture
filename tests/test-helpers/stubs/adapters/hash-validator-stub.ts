import { HashValidatorInterface } from "../../../../src/data/protocols";

export class HashValidatorStub implements HashValidatorInterface {
  public validate(value: string, hashedValue: string): boolean {
    return true;
  }
}
