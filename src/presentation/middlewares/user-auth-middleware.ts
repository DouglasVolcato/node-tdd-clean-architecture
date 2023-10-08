import { GetUserByTokenServiceInterface } from "../../domain/protocols";
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
  private readonly getUserByTokenService: GetUserByTokenServiceInterface;

  public constructor(getUserByTokenService: GetUserByTokenServiceInterface) {
    super();
    this.getUserByTokenService = getUserByTokenService;
  }

  protected async perform(request: any): Promise<any | Error> {
    const authorizationSplit = request.authorization.split(" ");
    if (!authorizationSplit || authorizationSplit[0] !== "Bearer") {
      return new UnauthorizedError();
    }
    const foundUser = await this.getUserByTokenService.execute(
      authorizationSplit[1]
    );
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
