import { LoginUseCaseInterface } from "../../../../src/domain/protocols";

export class LoginServiceStub implements LoginUseCaseInterface.Service {
  public async execute(
    login: LoginUseCaseInterface.Input
  ): Promise<LoginUseCaseInterface.Output> {
    return Promise.resolve("valid_token");
  }
}
