import { UserEntityType } from "../entities/user-entity-type";

export interface DeleteUserRepository {
  delete(id: string): Promise<UserEntityType | undefined>;
}
