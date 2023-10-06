import {
  GetUserByEmailRepositoryInterface,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class GetUserByEmailRepositoryStub
  implements GetUserByEmailRepositoryInterface
{
  public getByEmail(email: string): Promise<UserEntityType | undefined> {
    return Promise.resolve(makeUserEntity());
  }
}
