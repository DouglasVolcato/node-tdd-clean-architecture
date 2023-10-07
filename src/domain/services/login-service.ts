import { InvalidFieldError } from "../../presentation/errors";
import { Env } from "../../main/config";
import {
  LoginServiceInterface,
  GetUserByEmailRepositoryInterface,
  HashValidatorInterface,
  TokenGeneratorInterface,
  LoginDtoType,
} from "../../domain/abstract";

export class LoginService implements LoginServiceInterface {
  private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  private readonly hashValidator: HashValidatorInterface;
  private readonly tokenGenerator: TokenGeneratorInterface;

  public constructor(
    getUserByEmailRepository: GetUserByEmailRepositoryInterface,
    hashValidator: HashValidatorInterface,
    tokenGenerator: TokenGeneratorInterface
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.hashValidator = hashValidator;
    this.tokenGenerator = tokenGenerator;
  }

  public async execute(login: LoginDtoType): Promise<string | Error> {
    const vars = new Env().getVariables();
    const foundUser = await this.getUserByEmailRepository.getByEmail(
      login.email
    );
    if (!foundUser) return new InvalidFieldError("email");
    const passwordValid = this.hashValidator.validate(
      login.password,
      foundUser.password
    );
    if (!passwordValid) return new InvalidFieldError("password");
    const token = this.tokenGenerator.generateToken(
      { id: foundUser.id },
      vars.SECRET
    );
    return token;
  }
}
