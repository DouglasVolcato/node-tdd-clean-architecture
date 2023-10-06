import {
  DeleteUserRepositoryInterface,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class DeleteUserRepositoryStub implements DeleteUserRepositoryInterface {
  public async delete(id: string): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
