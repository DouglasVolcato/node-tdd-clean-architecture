import {
  DeleteUserServiceInterface,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class DeleteUserServiceStub implements DeleteUserServiceInterface {
  public execute(id: string): Promise<Error | UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
