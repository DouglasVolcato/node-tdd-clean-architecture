import { LoginUseCaseInterface } from "../../domain/protocols";
import { badRequest, ok } from "../../presentation/helpers";
import { LoginDtoType, TokenDtoType } from "../../data/protocols";
import { Controller } from "./controller";
import {
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../../presentation/protocols";
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../presentation/validators";

export class LoginController extends Controller implements ControllerInterface {
  private readonly loginService: LoginUseCaseInterface.Service;

  public constructor(loginService: LoginUseCaseInterface.Service) {
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
