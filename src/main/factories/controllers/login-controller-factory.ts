import { LoginController } from "../../../presentation/controllers";
import { LoginService } from "../../../domain/services/login-service";
import { UserRepository } from "../../../infra/database";
import { HasherAdapter } from "../../../infra/adapters";
import { TokenHandlerAdapter } from "../../../infra/adapters/token-handler-adapter";
import { makeErrorLogControllerDecoratorFactory } from "../decorators/error-log-decorator-factory";
import { ControllerInterface } from "../../../presentation/abstract";

export function makeLoginControllerFactory(): ControllerInterface {
  const getUserByEmailRepository = new UserRepository();
  const hashValidator = new HasherAdapter(10);
  const tokenGenerator = new TokenHandlerAdapter();
  const loginService = new LoginService(
    getUserByEmailRepository,
    hashValidator,
    tokenGenerator
  );
  const controller = new LoginController(loginService);
  return makeErrorLogControllerDecoratorFactory(controller);
}
