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
} from "@/domain/abstract";
import { badRequest, ok, serverError } from "../helpers";

export class CreateUserController implements ControllerInterface {
  private readonly validator: ValidatorInterface;
  private readonly createUserService: CreateUserServiceInterface;

  public constructor(
    validator: ValidatorInterface,
    createUserService: CreateUserServiceInterface
  ) {
    this.validator = validator;
    this.createUserService = createUserService;
  }

  public async execute(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>> {
    try {
      const error = this.validator.validate(request);
      if (error) return badRequest(error);
      const user = await this.createUserService.execute(request);
      return ok(user);
    } catch (error) {
      return serverError();
    }
  }
}
