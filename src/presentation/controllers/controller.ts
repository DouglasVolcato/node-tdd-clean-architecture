import { ValidatorComposite } from "../../presentation/validators";
import {
  ControllerInterface,
  ControllerInputType,
  ControllerOutputType,
  ValidatorInterface,
} from "../abstract";
import { badRequest, serverError } from "../helpers";

export abstract class Controller implements ControllerInterface {
  private readonly validatorComposite: ValidatorInterface;

  public constructor() {
    this.validatorComposite = new ValidatorComposite(this.buildValidators());
  }

  protected abstract perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;

  protected abstract buildValidators(): ValidatorInterface[];

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
    return this.validatorComposite.validate(request);
  }
}
