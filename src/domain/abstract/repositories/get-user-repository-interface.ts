import { UserEntityType } from "../entities/user-entity-type";

export interface GetUserRepositoryInterface {
  getByEmail(email: string): Promise<UserEntityType | undefined>;
}
