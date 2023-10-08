import { UserEntityType } from "../../../domain/protocols/entities/user-entity-type";

export interface GetUserByIdRepositoryInterface {
  getById(id: string): Promise<UserEntityType | undefined>;
}
