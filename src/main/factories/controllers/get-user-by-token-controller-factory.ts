import { makeErrorLogControllerDecoratorFactory } from "../decorators/error-log-decorator-factory";
import { TokenHandlerAdapter } from "../../../infra/adapters/token-handler-adapter";
import { GetUserByTokenController } from "../../../presentation/controllers";
import { ControllerInterface } from "../../../presentation/protocols";
import { GetUserByTokenService } from "../../../data/services";
import { UserRepository } from "../../../infra/database";

export function makeGetUserByTokenFactoryFactory(): ControllerInterface {
  const getUserByIdRepository = new UserRepository();
  const tokenValidator = new TokenHandlerAdapter();
  const getUserByTokenService = new GetUserByTokenService(
    tokenValidator,
    getUserByIdRepository
  );
  const controller = new GetUserByTokenController(getUserByTokenService);
  return makeErrorLogControllerDecoratorFactory(controller);
}
