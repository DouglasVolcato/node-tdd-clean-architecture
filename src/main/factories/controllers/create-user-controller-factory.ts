import { UserRepository } from "../../../infra/database";
import { CreateUserService } from "../../../domain/services";
import { HasherAdapter, IdGeneratorAdapter } from "../../../infra/adapters";
import { CreateUserController } from "../../../presentation/controllers";
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../../presentation/validators";

export function makeCreateUserControllerFactory(): CreateUserController {
  const idGenerator = new IdGeneratorAdapter();
  const createUserRepository = new UserRepository();
  const hasher = new HasherAdapter(10);
  const createUserService = new CreateUserService(
    createUserRepository,
    idGenerator,
    hasher
  );
  const validator = new ValidatorComposite([
    new ValidatorBuilder().of("name").isRequired(),
    new ValidatorBuilder().of("email").isRequired(),
    new ValidatorBuilder().of("email").isEmail(),
    new ValidatorBuilder().of("password").isRequired(),
  ]);
  return new CreateUserController(validator, createUserService);
}
