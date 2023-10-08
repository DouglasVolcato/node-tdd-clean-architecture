import { LoginDtoType } from "../../../data/protocols";

export interface LoginServiceInterface {
  execute(login: LoginDtoType): Promise<string | Error>;
}
