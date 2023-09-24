import { UserEntityType } from "../entities/user-entity-type";

export interface CreateUserRepositoryInterface {
  execute(userDto: UserEntityType): Promise<UserEntityType>;
}
