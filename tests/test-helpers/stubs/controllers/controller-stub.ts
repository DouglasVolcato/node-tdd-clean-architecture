import {
  ControllerInterface,
  ControllerInputType,
  ControllerOutputType,
  ValidatorInterface,
} from "../../../../src/presentation/abstract";
import { Controller } from "../../../../src/presentation/controllers";
import { ok } from "../../../../src/presentation/helpers";
import { ValidatorStub } from "../validators/validator-stub";

export class ControllerStub extends Controller implements ControllerInterface {
  public constructor() {
    super();
  }

  public async perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>> {
    return ok("any_data");
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorStub();
  }
}
