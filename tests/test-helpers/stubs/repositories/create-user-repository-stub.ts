import {
  CreateUserRepositoryInterface,
  UserDtoType,
  UserEntityType,
} from "../../../../src/domain/abstract";
import { makeUserEntity } from "../../entities/user-entity-helper";

export class CreateUserRepositoryStub implements CreateUserRepositoryInterface {
  public async create(userDto: UserDtoType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
