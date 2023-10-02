import { UserRepository } from "../../../infra/database";
import { CreateUserService } from "../../../domain/services";
import { HasherAdapter, IdGeneratorAdapter } from "../../../infra/adapters";
import { CreateUserController } from "../../../presentation/controllers";

export function makeCreateUserControllerFactory(): CreateUserController {
  const idGenerator = new IdGeneratorAdapter();
  const userRepository = new UserRepository();
  const hasher = new HasherAdapter(10);
  const createUserService = new CreateUserService(
    userRepository,
    userRepository,
    idGenerator,
    hasher
  );
  return new CreateUserController(createUserService);
}
