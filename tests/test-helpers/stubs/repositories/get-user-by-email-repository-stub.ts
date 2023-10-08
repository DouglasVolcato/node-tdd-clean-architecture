import { GetUserByEmailRepositoryInterface } from "../../../../src/data/protocols";
import { UserEntityType } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class GetUserByEmailRepositoryStub
  implements GetUserByEmailRepositoryInterface
{
  public getByEmail(email: string): Promise<UserEntityType | undefined> {
    return Promise.resolve(makeUserEntity());
  }
}
