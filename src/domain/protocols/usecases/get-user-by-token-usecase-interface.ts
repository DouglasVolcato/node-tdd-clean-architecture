import { UserEntityType } from "../entities/user-entity-type";

export namespace GetUserByTokenUseCaseInterface {
  export interface Service {
    execute(input: Input): Promise<Output>;
  }

  export type Input = {
    token: string;
  };

  export type Output = UserEntityType | Error;
}
