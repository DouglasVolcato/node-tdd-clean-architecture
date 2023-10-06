import { EmailValidatorInterface } from "../../../../src/presentation/abstract";

export class EmailValidatorStub implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return true;
  }
}
