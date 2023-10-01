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

export class CreateUserController
  extends Controller
  implements ControllerInterface
{
  private readonly createUserService: CreateUserServiceInterface;

  public constructor(
    validator: ValidatorInterface,
    createUserService: CreateUserServiceInterface
  ) {
    super(validator);
    this.createUserService = createUserService;
  }

  protected async perform(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const user = await this.createUserService.execute(request);
    return ok(user);
  }
}
