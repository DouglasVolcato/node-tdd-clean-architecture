import {
  LoginDtoType,
  LoginServiceInterface,
  TokenDtoType,
} from "../../domain/abstract";
import { Controller } from "./controller";
import {
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../../presentation/abstract";
import { badRequest, ok } from "../../presentation/helpers";

export class LoginController extends Controller implements ControllerInterface {
  private readonly loginService: LoginServiceInterface;

  public constructor(
    validator: ValidatorInterface,
    loginService: LoginServiceInterface
  ) {
    super(validator);
    this.loginService = loginService;
  }

  protected async perform(
    request: LoginDtoType
  ): Promise<ControllerOutputType<TokenDtoType | Error>> {
    const token = await this.loginService.execute(request);
    if (token instanceof Error) return badRequest(token);
    return ok({ token });
  }
}
