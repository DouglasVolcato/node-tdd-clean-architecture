import { UserEntityType } from "../entities/user-entity-type";

export interface GetUserByTokenServiceInterface {
  execute(token: string): Promise<UserEntityType | Error>;
}
