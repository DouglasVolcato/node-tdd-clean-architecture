import { UserEntityType } from "../../../domain/protocols";
import { UserModel } from "../models/user-model";
import {
  CreateUserRepositoryInterface,
  DeleteUserRepositoryInterface,
  GetUserByEmailRepositoryInterface,
  GetUserByIdRepositoryInterface,
} from "../../../data/protocols";

export class UserRepository
  implements
    CreateUserRepositoryInterface,
    GetUserByEmailRepositoryInterface,
    GetUserByIdRepositoryInterface,
    DeleteUserRepositoryInterface
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

  public async getById(id: string): Promise<UserEntityType | undefined> {
    const foundUser = await UserModel.findOne({ id }).exec();
    return foundUser ? foundUser : undefined;
  }

  public async delete(id: string): Promise<UserEntityType | undefined> {
    const foundUser = await this.getById(id);
    if (!foundUser) return undefined;
    await UserModel.deleteOne({ id }).exec();
    return foundUser;
  }
}
