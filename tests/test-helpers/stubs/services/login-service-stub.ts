import { LoginDtoType } from "../../../../src/data/protocols";
import { LoginServiceInterface } from "../../../../src/domain/protocols";

export class LoginServiceStub implements LoginServiceInterface {
  public async execute(login: LoginDtoType): Promise<string | Error> {
    return Promise.resolve("valid_token");
  }
}
