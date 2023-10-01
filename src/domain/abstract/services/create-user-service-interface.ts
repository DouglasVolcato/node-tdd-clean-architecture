import { UserDtoType } from "../dtos/user-dto-type";
import { UserEntityType } from "../entities/user-entity-type";

export interface CreateUserServiceInterface {
  execute(userDto: UserDtoType): Promise<UserEntityType | Error>;
}
