import { UserEntityType } from "../entities/user-entity-type";

export interface CreateUserRepositoryInterface {
  create(userEntity: UserEntityType): Promise<UserEntityType>;
}
