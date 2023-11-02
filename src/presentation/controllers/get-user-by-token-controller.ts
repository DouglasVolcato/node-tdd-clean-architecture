import { ValidatorBuilder, ValidatorComposite } from "../validators";
import { InvalidFieldError } from "../errors";
import { badRequest, ok } from "../helpers";
import { Controller } from "./controller";
import {
  GetUserByTokenUseCaseInterface,
  UserEntityType,
} from "../../domain/protocols";
import {
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../protocols";

export class GetUserByTokenController
  extends Controller
  implements ControllerInterface
{
  private readonly getUserByTokenService: GetUserByTokenUseCaseInterface.Service;

  public constructor(
    getUserByTokenService: GetUserByTokenUseCaseInterface.Service
  ) {
    super();
    this.getUserByTokenService = getUserByTokenService;
  }

  protected async perform(
    request: any
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const authorizationSplit = request.authorization.split(" ");
    const foundUser = await this.getUserByTokenService.execute({
      token: authorizationSplit[1],
    });
    if (!foundUser || foundUser instanceof Error) {
      return badRequest(new InvalidFieldError("authorization"));
    }
    return ok(foundUser);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("authorization").isRequired(),
    ]);
  }
}
