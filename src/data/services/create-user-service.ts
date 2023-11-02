import { CreateUserUseCaseInterface } from "../../domain/protocols";
import { InvalidFieldError } from "../../presentation/errors";
import {
  GetUserByEmailRepositoryInterface,
  HasherInterface,
  IdGeneratorInterface,
  CreateUserRepositoryInterface,
} from "../protocols";

export class CreateUserService implements CreateUserUseCaseInterface.Service {
  private readonly createUserRepository: CreateUserRepositoryInterface;
  private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  private readonly idGenerator: IdGeneratorInterface;
  private readonly hasher: HasherInterface;

  public constructor(
    createUserRepository: CreateUserRepositoryInterface,
    getUserByEmailRepository: GetUserByEmailRepositoryInterface,
    idGenerator: IdGeneratorInterface,
    hasher: HasherInterface
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGenerator = idGenerator;
    this.hasher = hasher;
  }

  public async execute(
    userDto: CreateUserUseCaseInterface.Input
  ): Promise<CreateUserUseCaseInterface.Output> {
    const foundUser = await this.getUserByEmailRepository.getByEmail(
      userDto.email
    );
    if (foundUser) return new InvalidFieldError("email");
    const id = this.idGenerator.generateId();
    const hashedPassword = this.hasher.hash(userDto.password);
    return await this.createUserRepository.create({
      ...userDto,
      id: id,
      password: hashedPassword,
    });
  }
}
