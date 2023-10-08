import { makeUserEntity } from "../../entities/user-entity-helper";
import {
  DeleteUserServiceInterface,
  UserEntityType,
} from "../../../../src/domain/protocols";

export class DeleteUserServiceStub implements DeleteUserServiceInterface {
  public execute(id: string): Promise<Error | UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
