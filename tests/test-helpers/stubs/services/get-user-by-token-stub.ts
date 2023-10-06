import {
  GetUserByTokenServiceInterface,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class GetUserByTokenServiceStub
  implements GetUserByTokenServiceInterface
{
  public async execute(token: string): Promise<UserEntityType | Error> {
    return Promise.resolve(makeUserEntity());
  }
}
