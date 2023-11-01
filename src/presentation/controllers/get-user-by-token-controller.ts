import { ValidatorBuilder, ValidatorComposite } from "../validators";
import { InvalidFieldError } from "../errors";
import { badRequest, ok } from "../helpers";
import { Controller } from "./controller";
import {
  GetUserByTokenServiceInterface,
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
  private readonly getUserByTokenService: GetUserByTokenServiceInterface;

  public constructor(getUserByTokenService: GetUserByTokenServiceInterface) {
    super();
    this.getUserByTokenService = getUserByTokenService;
  }

  protected async perform(
    request: any
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const authorizationSplit = request.authorization.split(" ");
    const foundUser = await this.getUserByTokenService.execute(
      authorizationSplit[1]
    );
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
