import {
  CreateUserRepositoryInterface,
  UserEntityType,
} from "../../../domain/abstract";
import { UserModel } from "../models/user-model";

export class UserRepository implements CreateUserRepositoryInterface {
  public async create(userEntity: UserEntityType): Promise<UserEntityType> {
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser.toObject();
  }
}
