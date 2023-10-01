import { GetUserByEmailRepositoryInterface } from "../../../domain/abstract/repositories/get-user-repository-interface";
import {
  CreateUserRepositoryInterface,
  UserEntityType,
} from "../../../domain/abstract";
import { UserModel } from "../models/user-model";

export class UserRepository
  implements CreateUserRepositoryInterface, GetUserByEmailRepositoryInterface
{
  public async create(userEntity: UserEntityType): Promise<UserEntityType> {
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser.toObject();
  }

  public async getByEmail(email: string): Promise<UserEntityType | undefined> {
    const foundUser = await UserModel.findOne({ email }).exec();
    return foundUser ? foundUser : undefined;
  }
}
