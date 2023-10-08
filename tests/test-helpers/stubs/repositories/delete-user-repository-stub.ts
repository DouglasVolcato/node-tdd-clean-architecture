import { DeleteUserRepositoryInterface } from "../../../../src/data/protocols";
import { UserEntityType } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class DeleteUserRepositoryStub implements DeleteUserRepositoryInterface {
  public async delete(id: string): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
