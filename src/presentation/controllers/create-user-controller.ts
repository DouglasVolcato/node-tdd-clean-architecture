import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../abstract";
import {
  CreateUserServiceInterface,
  UserDtoType,
  UserEntityType,
} from "../../domain/abstract";
import { ok } from "../helpers";
import { Controller } from "./controller";
import { ValidatorBuilder } from "../validators";

export class CreateUserController
  extends Controller
  implements ControllerInterface
{
  private readonly createUserService: CreateUserServiceInterface;

  public constructor(
    createUserService: CreateUserServiceInterface,
  ) {
    super();
    this.createUserService = createUserService;
  }

  protected async perform(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const user = await this.createUserService.execute(request);
    return ok(user);
  }

  protected override buildValidators(): ValidatorInterface[] {
    return [
      new ValidatorBuilder().of("name").isRequired(),
      new ValidatorBuilder().of("email").isRequired(),
      new ValidatorBuilder().of("email").isEmail(),
      new ValidatorBuilder().of("password").isRequired(),
    ];
  }
}
