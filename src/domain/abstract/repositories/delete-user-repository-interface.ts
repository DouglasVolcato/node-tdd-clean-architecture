import { UserEntityType } from "../entities/user-entity-type";

export interface DeleteUserRepositoryInterface {
  delete(id: string): Promise<UserEntityType | undefined>;
}
