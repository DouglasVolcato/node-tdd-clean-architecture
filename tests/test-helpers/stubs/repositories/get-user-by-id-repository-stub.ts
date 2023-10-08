import { GetUserByIdRepositoryInterface } from "../../../../src/data/protocols";
import { UserEntityType } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class GetUserByIdRepositoryStub
  implements GetUserByIdRepositoryInterface
{
  public async getById(id: string): Promise<UserEntityType | undefined> {
    return Promise.resolve(makeUserEntity());
  }
}
