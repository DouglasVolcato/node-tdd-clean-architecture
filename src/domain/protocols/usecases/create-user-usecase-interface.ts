import { UserDtoType } from "../../../data/protocols";
import { UserEntityType } from "../entities/user-entity-type";

export namespace CreateUserUseCaseInterface {
  export interface Service {
    execute(input: Input): Promise<Output>;
  }

  export type Input = UserDtoType;

  export type Output = UserEntityType | Error;
}
