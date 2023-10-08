import { EmailValidatorInterface } from "../../../../src/presentation/protocols";

export class EmailValidatorStub implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return true;
  }
}
