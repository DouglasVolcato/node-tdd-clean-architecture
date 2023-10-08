import { UserEntityType } from "../../../domain/protocols/entities/user-entity-type";

export interface CreateUserRepositoryInterface {
  create(userEntity: UserEntityType): Promise<UserEntityType>;
}
