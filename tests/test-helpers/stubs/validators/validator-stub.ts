import { ValidatorInterface } from "../../../../src/presentation/abstract";

export class ValidatorStub implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}
