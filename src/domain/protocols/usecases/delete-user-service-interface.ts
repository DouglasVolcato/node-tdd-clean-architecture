import { UserEntityType } from "../entities/user-entity-type";

export interface DeleteUserServiceInterface {
  execute(id: string): Promise<UserEntityType | Error>;
}
