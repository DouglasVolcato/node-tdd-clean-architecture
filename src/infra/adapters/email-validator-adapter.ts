import { EmailValidatorInterface } from "../../presentation/protocols";
import { validate } from "email-validator";

export class EmailValidatorAdapter implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
