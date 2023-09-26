import { UserEntityType } from "../entities/user-entity-type";

export interface CreateUserRepositoryInterface {
  execute(userEntity: UserEntityType): Promise<UserEntityType>;
}
