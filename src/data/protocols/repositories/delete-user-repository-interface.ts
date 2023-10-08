import { UserEntityType } from "../../../domain/protocols/entities/user-entity-type";

export interface DeleteUserRepositoryInterface {
  delete(id: string): Promise<UserEntityType | undefined>;
}
