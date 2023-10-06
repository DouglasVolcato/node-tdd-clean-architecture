import { ErrorLogServiceInterface } from "../../../../src/domain/abstract";

export class ErrorLogServiceStub implements ErrorLogServiceInterface {
  public async execute(error: Error): Promise<void> {
    return Promise.resolve();
  }
}
