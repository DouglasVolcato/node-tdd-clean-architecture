import { ControllerInterface } from "../../../presentation/abstract";
import { DeleteUserService } from "../../../domain/services";
import { UserRepository } from "../../../infra/database";
import { DeleteUserController } from "../../../presentation/controllers";
import { makeErrorLogControllerDecoratorFactory } from "../decorators/error-log-decorator-factory";

export function makeDeleteUserControllerFactory(): ControllerInterface {
  const deleteUserRepository = new UserRepository();
  const deleteUserService = new DeleteUserService(deleteUserRepository);
  const controller = new DeleteUserController(deleteUserService);
  return makeErrorLogControllerDecoratorFactory(controller);
}
