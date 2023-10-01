import { LoginController } from "../../../presentation/controllers";
import { LoginService } from "../../../domain/services/login-service";
import { UserRepository } from "../../../infra/database";
import { HasherAdapter } from "../../../infra/adapters";
import { TokenHandlerAdapter } from "../../../infra/adapters/token-handler-adapter";

export function makeLoginControllerFactory(): LoginController {
  const getUserByEmailRepository = new UserRepository();
  const hashValidator = new HasherAdapter(10);
  const tokenGenerator = new TokenHandlerAdapter();
  const loginService = new LoginService(
    getUserByEmailRepository,
    hashValidator,
    tokenGenerator
  );
  return new LoginController(loginService);
}
