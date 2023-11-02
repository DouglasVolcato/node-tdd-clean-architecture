import { InvalidFieldError } from "../../presentation/errors";
import { DeleteUserRepositoryInterface } from "../../data/protocols";
import { DeleteUserUseCaseInterface } from "../../domain/protocols";

export class DeleteUserService implements DeleteUserUseCaseInterface.Service {
  private readonly deleteUserRepository: DeleteUserRepositoryInterface;

  public constructor(deleteUserRepository: DeleteUserRepositoryInterface) {
    this.deleteUserRepository = deleteUserRepository;
  }

  public async execute({
    id,
  }: DeleteUserUseCaseInterface.Input): Promise<DeleteUserUseCaseInterface.Output> {
    const deletedUser = await this.deleteUserRepository.delete(id);
    return deletedUser ?? new InvalidFieldError("id");
  }
}
