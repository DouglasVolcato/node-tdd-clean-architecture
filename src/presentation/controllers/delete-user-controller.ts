import { badRequest, ok, unauthorized } from "../../presentation/helpers";
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
import {
  DeleteUserUseCaseInterface,
  UserEntityType,
} from "../../domain/protocols";

export class DeleteUserController
  extends Controller
  implements ControllerInterface
{
  private readonly deleteUserService: DeleteUserUseCaseInterface.Service;

  public constructor(deleteUserService: DeleteUserUseCaseInterface.Service) {
    super();
    this.deleteUserService = deleteUserService;
  }

  protected async perform(
    request: any
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    if (request.user.id !== request.id) return unauthorized();
    const deletedUser = await this.deleteUserService.execute({
      id: request.id,
    });
    if (deletedUser instanceof Error) return badRequest(deletedUser);
    return ok(deletedUser);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("user").isRequired(),
      new ValidatorBuilder().of("id").isRequired(),
    ]);
  }
}
