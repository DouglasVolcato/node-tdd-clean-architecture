import { UserEntityType } from "../entities/user-entity-type";

export namespace DeleteUserUseCaseInterface {
  export interface Service {
    execute(input: Input): Promise<Output>;
  }

  export type Input = { id: string };

  export type Output = UserEntityType | Error;
}
