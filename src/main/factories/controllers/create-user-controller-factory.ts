import { UserRepository } from "../../../infra/database";
import { CreateUserService } from "../../../domain/services";
import { HasherAdapter, IdGeneratorAdapter } from "../../../infra/adapters";
import { CreateUserController } from "../../../presentation/controllers";
import { makeErrorLogControllerDecoratorFactory } from "../decorators/error-log-decorator-factory";
import { ControllerInterface } from "../../../presentation/abstract";

export function makeCreateUserControllerFactory(): ControllerInterface {
  const idGenerator = new IdGeneratorAdapter();
  const userRepository = new UserRepository();
  const hasher = new HasherAdapter(10);
  const createUserService = new CreateUserService(
    userRepository,
    userRepository,
    idGenerator,
    hasher
  );
  const controller = new CreateUserController(createUserService);
  return makeErrorLogControllerDecoratorFactory(controller);
}
