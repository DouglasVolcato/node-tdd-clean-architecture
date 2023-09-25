import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
  ValidatorCompositeInterface,
} from "../abstract";
import {
  CreateUserServiceInterface,
  UserDtoType,
  UserEntityType,
} from "@/domain/abstract";
import { ok } from "../helpers";
import { Controller } from "./controller";

export class CreateUserController
  extends Controller
  implements ControllerInterface
{
  private readonly createUserService: CreateUserServiceInterface;

  public constructor(createUserService: CreateUserServiceInterface,validatorComposite: ValidatorCompositeInterface) {
    super(validatorComposite);
    this.createUserService = createUserService;
  }

  public async perform(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    const user = await this.createUserService.execute(request);
    return ok(user);
  }
}
