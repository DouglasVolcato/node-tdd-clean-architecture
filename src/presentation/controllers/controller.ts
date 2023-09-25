import {
  ControllerInterface,
  ControllerInputType,
  ControllerOutputType,
  ValidatorInterface,
  ValidatorCompositeInterface,
} from "../abstract";
import { badRequest, serverError } from "../helpers";

export abstract class Controller implements ControllerInterface {
  private readonly validatorComposite: ValidatorCompositeInterface;

  public constructor(validatorComposite: ValidatorCompositeInterface) {
    this.validatorComposite = validatorComposite;
  }

  protected abstract perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;

  protected abstract buildValidators(): ValidatorInterface[]

  public async execute(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>> {
    try {
      const error = this.validate(request);
      if (error !== undefined) return badRequest(error);
      return await this.perform(request);
    } catch (error) {
      return serverError();
    }
  }

  private validate(request: ControllerInputType<any>): Error | undefined {
    this.validatorComposite.setValidators(this.buildValidators());
    return this.validatorComposite.validate(request);
  }
}
