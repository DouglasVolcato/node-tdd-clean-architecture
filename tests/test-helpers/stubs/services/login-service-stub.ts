import {
  LoginDtoType,
  LoginServiceInterface,
} from "../../../../src/domain/abstract";

export class LoginServiceStub implements LoginServiceInterface {
  public async execute(login: LoginDtoType): Promise<string | Error> {
    return Promise.resolve("valid_token");
  }
}
