import { EmailValidatorInterface, ValidatorBuilderInterface } from "../abstract";
import { InvalidFieldError, RequiredFieldError } from "../errors";

export class ValidatorBuilder implements ValidatorBuilderInterface {
  private readonly emailValidator: EmailValidatorInterface;
  private requiredFields: string[] = [];
  private emailFields: string[] = [];

  public constructor(emailValidator: EmailValidatorInterface) {
    this.emailValidator = emailValidator;
  }

  public validate(request: any): Error | undefined {
    for (const field of this.requiredFields) {
      if (!(field in request)) return new RequiredFieldError(field);
    }
    for (const field of this.emailFields) {
      const error = this.emailValidator.isEmail(field);
      if (!error) return new InvalidFieldError(field);
    }
    return;
  }

  public isRequired(fieldName: string): ValidatorBuilderInterface {
    this.requiredFields.push(fieldName);
    return this;
  }

  public isEmail(fieldName: string): ValidatorBuilderInterface {
    this.isRequired(fieldName);
    this.emailFields.push(fieldName);
    return this;
  }
}
