import { UserEntityType } from "../entities/user-entity-type";

export interface GetUserByEmailRepositoryInterface {
  getByEmail(email: string): Promise<UserEntityType | undefined>;
}
