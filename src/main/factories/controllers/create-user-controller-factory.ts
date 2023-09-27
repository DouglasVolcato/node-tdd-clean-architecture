import { CreateUserService } from "../../../domain/services";
import { HasherAdapter, IdGeneratorAdapter } from "../../../infra/adapters";
import { UserRepository } from "../../../infra/database";
import { CreateUserController } from "../../../presentation/controllers";
import { ValidatorComposite } from "../../../presentation/validators";

export function makeCreateUserControllerFactory(): CreateUserController {
  const createUserRepository = new UserRepository();
  const idGenerator = new IdGeneratorAdapter();
  const hasher = new HasherAdapter(10);
  const createUserService = new CreateUserService(
    createUserRepository,
    idGenerator,
    hasher
  );
  const validatorComposite = new ValidatorComposite();
  return new CreateUserController(createUserService, validatorComposite);
}
