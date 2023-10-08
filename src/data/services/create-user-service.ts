import { CreateUserServiceInterface, UserEntityType } from "../../domain/protocols";
import { InvalidFieldError } from "../../presentation/errors";
import {
  GetUserByEmailRepositoryInterface,
  UserDtoType,
  HasherInterface,
  IdGeneratorInterface,
  CreateUserRepositoryInterface,
} from "../protocols";

export class CreateUserService implements CreateUserServiceInterface {
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

  public async execute(userDto: UserDtoType): Promise<UserEntityType | Error> {
    const foundUser = await this.getUserByEmailRepository.getByEmail(
      userDto.email
    );
    if (foundUser) return new InvalidFieldError("email already registered");
    const id = this.idGenerator.generateId();
    const hashedPassword = this.hasher.hash(userDto.password);
    return await this.createUserRepository.create({
      ...userDto,
      id: id,
      password: hashedPassword,
    });
  }
}
