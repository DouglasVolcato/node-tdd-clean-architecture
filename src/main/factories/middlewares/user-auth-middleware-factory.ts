import { GetUserByTokenService } from "../../../domain/services";
import { TokenHandlerAdapter } from "../../../infra/adapters/token-handler-adapter";
import { UserRepository } from "../../../infra/database";
import { UserAuthMiddleware } from "../../../presentation/middlewares";

export function makeUserAuthMiddlewareFactory(): UserAuthMiddleware {
  const getUserByIdRepository = new UserRepository();
  const tokenValidator = new TokenHandlerAdapter();
  const getUserByTokenService = new GetUserByTokenService(
    tokenValidator,
    getUserByIdRepository
  );
  return new UserAuthMiddleware(getUserByTokenService);
}
