import { UserDtoType } from "../../data/protocols";
import { badRequest, ok } from "../helpers";
import { Controller } from "./controller";
import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../protocols";
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../presentation/validators";
import {
  CreateUserServiceInterface,
  UserEntityType,
} from "../../domain/protocols";

export class CreateUserController
  extends Controller
  implements ControllerInterface
{
  private readonly createUserService: CreateUserServiceInterface;

  public constructor(createUserService: CreateUserServiceInterface) {
    super();
    this.createUserService = createUserService;
  }

  protected async perform(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const user = await this.createUserService.execute(request);
    if (user instanceof Error) return badRequest(user);
    return ok(user);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("name").isRequired(),
      new ValidatorBuilder().of("email").isRequired(),
      new ValidatorBuilder().of("email").isEmail(),
      new ValidatorBuilder().of("password").isRequired(),
    ]);
  }
}
