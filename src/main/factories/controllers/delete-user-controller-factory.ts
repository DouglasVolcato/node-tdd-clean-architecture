import { DeleteUserService } from "../../../domain/services";
import { UserRepository } from "../../../infra/database";
import { DeleteUserController } from "../../../presentation/controllers";

export function makeDeleteUserControllerFactory(): DeleteUserController {
  const deleteUserRepository = new UserRepository();
  const deleteUserService = new DeleteUserService(deleteUserRepository);
  return new DeleteUserController(deleteUserService);
}
