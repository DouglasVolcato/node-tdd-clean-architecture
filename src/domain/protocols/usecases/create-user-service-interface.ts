import { UserDtoType } from "../../../data/protocols";
import { UserEntityType } from "../entities/user-entity-type";

export interface CreateUserServiceInterface {
  execute(userDto: UserDtoType): Promise<UserEntityType | Error>;
}
