import { makeUserEntity } from "../../entities/user-entity-helper";
import {
  GetUserByTokenServiceInterface,
  UserEntityType,
} from "../../../../src/domain/protocols";

export class GetUserByTokenServiceStub
  implements GetUserByTokenServiceInterface
{
  public async execute(token: string): Promise<UserEntityType | Error> {
    return Promise.resolve(makeUserEntity());
  }
}
