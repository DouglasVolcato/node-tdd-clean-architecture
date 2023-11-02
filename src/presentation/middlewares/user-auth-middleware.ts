import { GetUserByTokenUseCaseInterface } from "../../domain/protocols";
import { UnauthorizedError } from "../../presentation/errors";
import { Middleware } from "./middleware";
import {
  MiddlewareInterface,
  ValidatorInterface,
} from "../../presentation/protocols";
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../presentation/validators";

export class UserAuthMiddleware
  extends Middleware
  implements MiddlewareInterface
{
  private readonly getUserByTokenService: GetUserByTokenUseCaseInterface.Service;

  public constructor(
    getUserByTokenService: GetUserByTokenUseCaseInterface.Service
  ) {
    super();
    this.getUserByTokenService = getUserByTokenService;
  }

  protected async perform(request: any): Promise<any | Error> {
    const authorizationSplit = request.authorization.split(" ");
    if (!authorizationSplit || authorizationSplit[0] !== "Bearer") {
      return new UnauthorizedError();
    }
    const foundUser = await this.getUserByTokenService.execute({
      token: authorizationSplit[1],
    });
    if (!foundUser) {
      return new UnauthorizedError();
    }
    return { user: foundUser };
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("authorization").isRequired(),
    ]);
  }
}
