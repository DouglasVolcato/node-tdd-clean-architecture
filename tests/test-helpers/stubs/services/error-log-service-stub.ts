import { ErrorLogServiceInterface } from "../../../../src/domain/protocols";

export class ErrorLogServiceStub implements ErrorLogServiceInterface {
  public async execute(error: Error): Promise<void> {
    return Promise.resolve();
  }
}
