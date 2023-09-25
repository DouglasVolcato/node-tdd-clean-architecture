import {
  ValidatorCompositeInterface,
  ValidatorInterface,
} from "@/presentation/abstract";

export class ValidatorComposite
  implements ValidatorInterface, ValidatorCompositeInterface
{
  private validators!: ValidatorInterface[];

  public setValidators(validators: ValidatorInterface[]): void {
    this.validators = validators;
  }

  public validate(request: any): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate(request);
      if (error) return error;
    }
    return;
  }
}
