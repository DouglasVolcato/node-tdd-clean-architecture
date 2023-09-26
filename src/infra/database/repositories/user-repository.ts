import {
  CreateUserRepositoryInterface,
  UserEntityType,
} from "@/domain/abstract";
import { Env } from "@/main/config";
import { UserModel } from "../models/user-model";
import { DatabaseConnector } from "../connector";

export class UserRepository implements CreateUserRepositoryInterface {
  public async execute(userEntity: UserEntityType): Promise<UserEntityType> {
    await DatabaseConnector.connect(Env.MONGO_URL);
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser.toObject();
  }
}
