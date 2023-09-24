import {
  EmailValidatorInterface,
  ValidatorBuilderInterface,
} from "../abstract";
import { InvalidFieldError, RequiredFieldError } from "../errors";

export class ValidatorBuilder implements ValidatorBuilderInterface {
  private readonly emailValidator: EmailValidatorInterface;
  private fieldName: string;
  private validateRequired: boolean;
  private validateEmail: boolean;

  public constructor(emailValidator: EmailValidatorInterface) {
    this.emailValidator = emailValidator;
    this.fieldName = "";
    this.validateRequired = false;
    this.validateEmail = false;
  }

  public of(fieldName: string): ValidatorBuilderInterface {
    this.resetObject();
    this.fieldName = fieldName;
    return this;
  }

  public isRequired(): ValidatorBuilderInterface {
    this.validateRequired = true;
    return this;
  }

  public isEmail(): ValidatorBuilderInterface {
    this.validateEmail = true;
    return this;
  }

  public validate(request: any): Error | undefined {
    if (this.fieldName.trim() !== "") {
      if (this.validateRequired) {
        if (!(this.fieldName in request)) {
          return new RequiredFieldError(this.fieldName);
        }
      }

      if (this.validateEmail) {
        const error = this.emailValidator.isEmail(this.fieldName);
        if (!error) {
          return new InvalidFieldError(this.fieldName);
        }
      }
    }
    return;
  }

  private resetObject(): void {
    this.fieldName = "";
    this.validateRequired = false;
    this.validateEmail = false;
  }
}
