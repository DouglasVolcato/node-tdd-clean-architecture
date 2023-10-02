import {
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../../presentation/abstract";
import {
  DeleteUserServiceInterface,
  UserEntityType,
} from "../../domain/abstract";
import { badRequest, ok, unauthorized } from "../../presentation/helpers";
import {
  ValidatorBuilder,
  ValidatorComposite,
} from "../../presentation/validators";
import { Controller } from "./controller";

export class DeleteUserController
  extends Controller
  implements ControllerInterface
{
  private readonly deleteUserService: DeleteUserServiceInterface;

  public constructor(deleteUserService: DeleteUserServiceInterface) {
    super();
    this.deleteUserService = deleteUserService;
  }

  protected async perform(
    request: any
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    if (request.user.id !== request.id) return unauthorized();
    const deletedUser = await this.deleteUserService.execute(request.id);
    if (deletedUser instanceof Error) return badRequest(deletedUser);
    return ok(deletedUser);
  }

  protected getValidation(): ValidatorInterface {
    const validator = new ValidatorComposite([
      new ValidatorBuilder().of("user").isRequired(),
      new ValidatorBuilder().of("id").isRequired(),
    ]);
    return validator;
  }
}
