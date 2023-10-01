import { LoginDtoType } from "../dtos/login-dto-type";

export interface LoginServiceInterface {
  execute(login: LoginDtoType): Promise<string | Error>;
}
