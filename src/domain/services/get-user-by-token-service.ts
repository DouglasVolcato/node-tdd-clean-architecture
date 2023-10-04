import {
  GetUserByIdRepositoryInterface,
  GetUserByTokenServiceInterface,
  TokenValidatorInterface,
  UserEntityType,
} from "../../domain/abstract";
import { Env } from "../../main/config";
import { InvalidFieldError } from "../../presentation/errors";

export class GetUserByTokenService implements GetUserByTokenServiceInterface {
  private readonly tokenValidator: TokenValidatorInterface;
  private readonly getUserByIdRepository: GetUserByIdRepositoryInterface;

  public constructor(
    tokenValidator: TokenValidatorInterface,
    getUserByIdRepository: GetUserByIdRepositoryInterface
  ) {
    this.tokenValidator = tokenValidator;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  public async execute(token: string): Promise<UserEntityType | Error> {
    const vars = new Env().getVariables();
    const userId = this.tokenValidator.validateToken(token, vars.SECRET);
    if (!userId) return new InvalidFieldError("token");
    const foundUser = await this.getUserByIdRepository.getById(userId);
    if (!foundUser) return new InvalidFieldError("token");
    return foundUser;
  }
}
