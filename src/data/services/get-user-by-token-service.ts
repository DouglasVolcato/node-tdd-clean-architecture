import { Env } from "../../main/config";
import { InvalidFieldError } from "../../presentation/errors";
import { GetUserByTokenUseCaseInterface } from "../../domain/protocols";
import {
  TokenDecrypterInterface,
  GetUserByIdRepositoryInterface,
} from "../protocols";

export class GetUserByTokenService
  implements GetUserByTokenUseCaseInterface.Service
{
  private readonly tokenValidator: TokenDecrypterInterface;
  private readonly getUserByIdRepository: GetUserByIdRepositoryInterface;

  public constructor(
    tokenValidator: TokenDecrypterInterface,
    getUserByIdRepository: GetUserByIdRepositoryInterface
  ) {
    this.tokenValidator = tokenValidator;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  public async execute({
    token,
  }: GetUserByTokenUseCaseInterface.Input): Promise<GetUserByTokenUseCaseInterface.Output> {
    const vars = new Env().getVariables();
    const userId = this.tokenValidator.decryptToken(token, vars.SECRET);
    if (!userId) return new InvalidFieldError("token");
    const foundUser = await this.getUserByIdRepository.getById(userId);
    if (!foundUser) return new InvalidFieldError("token");
    return foundUser;
  }
}
