import { ErrorLogUseCaseInterface } from "../../../../src/domain/protocols";

export class ErrorLogServiceStub implements ErrorLogUseCaseInterface.Service {
  public async execute({
    error,
  }: ErrorLogUseCaseInterface.Input): Promise<ErrorLogUseCaseInterface.Output> {
    return Promise.resolve();
  }
}
