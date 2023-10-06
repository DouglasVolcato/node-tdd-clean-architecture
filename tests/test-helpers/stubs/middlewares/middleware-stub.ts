import { Middleware } from "../../../../src/presentation/middlewares";
import { ValidatorStub } from "../validators/validator-stub";
import {
  MiddlewareInterface,
  ValidatorInterface,
} from "../../../../src/presentation/abstract";

export class MiddlewareStub extends Middleware implements MiddlewareInterface {
  public constructor() {
    super();
  }

  protected async perform(request: any): Promise<any> {
    return Promise.resolve({});
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorStub();
  }
}
