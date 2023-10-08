import { makeUserEntity } from "../../entities/user-entity-helper";
import { UserDtoType } from "../../../../src/data/protocols";
import {
  CreateUserServiceInterface,
  UserEntityType,
} from "../../../../src/domain/protocols";

export class CreateUserServiceStub implements CreateUserServiceInterface {
  public async execute(userDto: UserDtoType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
