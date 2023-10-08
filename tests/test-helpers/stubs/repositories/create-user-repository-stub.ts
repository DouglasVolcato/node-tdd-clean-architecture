import { UserEntityType } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../entities/user-entity-helper";
import {
  CreateUserRepositoryInterface,
  UserDtoType,
} from "../../../../src/data/protocols";

export class CreateUserRepositoryStub implements CreateUserRepositoryInterface {
  public async create(userDto: UserDtoType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
