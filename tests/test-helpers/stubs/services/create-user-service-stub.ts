import {
  CreateUserServiceInterface,
  UserDtoType,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class CreateUserServiceStub implements CreateUserServiceInterface {
  public async execute(userDto: UserDtoType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
