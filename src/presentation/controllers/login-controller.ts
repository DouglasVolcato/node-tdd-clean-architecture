import { badRequest, ok } from "../../presentation/helpers";
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
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../presentation/validators";

export class LoginController extends Controller implements ControllerInterface {
  private readonly loginService: LoginServiceInterface;

  public constructor(loginService: LoginServiceInterface) {
    super();
    this.loginService = loginService;
  }

  protected async perform(
    request: LoginDtoType
  ): Promise<ControllerOutputType<TokenDtoType | Error>> {
    const token = await this.loginService.execute(request);
    if (token instanceof Error) return badRequest(token);
    return ok({ token });
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("email").isEmail(),
      new ValidatorBuilder().of("password").isRequired(),
    ]);
  }
}
