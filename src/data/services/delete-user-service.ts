import { InvalidFieldError } from "../../presentation/errors";
import { DeleteUserRepositoryInterface } from "../../data/protocols";
import {
  DeleteUserServiceInterface,
  UserEntityType,
} from "../../domain/protocols";

export class DeleteUserService implements DeleteUserServiceInterface {
  private readonly deleteUserRepository: DeleteUserRepositoryInterface;

  public constructor(deleteUserRepository: DeleteUserRepositoryInterface) {
    this.deleteUserRepository = deleteUserRepository;
  }

  public async execute(id: string): Promise<UserEntityType | Error> {
    const deletedUser = await this.deleteUserRepository.delete(id);
    return deletedUser ?? new InvalidFieldError("id");
  }
}
