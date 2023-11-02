import { LoginDtoType } from "../../../data/protocols";

export namespace LoginUseCaseInterface {
  export interface Service {
    execute(input: LoginDtoType): Promise<Output>;
  }

  export type Input = LoginDtoType;

  export type Output = string | Error;
}
