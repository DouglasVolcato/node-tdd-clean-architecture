import { InvalidFieldError } from "../../presentation/errors";
import {
  DeleteUserRepositoryInterface,
  DeleteUserServiceInterface,
  UserEntityType,
} from "../../domain/abstract";

export class DeleteUserService implements DeleteUserServiceInterface {
  private readonly deleteUserRepository: DeleteUserRepositoryInterface;

  public constructor(deleteUserRepository: DeleteUserRepositoryInterface) {
    this.deleteUserRepository = deleteUserRepository;
  }

  public async execute(id: string): Promise<UserEntityType | Error> {
    const deletedUser = await this.deleteUserRepository.delete(id);
    return deletedUser ? deletedUser : new InvalidFieldError("id");
  }
}
