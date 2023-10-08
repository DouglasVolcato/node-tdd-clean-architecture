import { ValidatorInterface } from "../../../../src/presentation/protocols";

export class ValidatorStub implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}
