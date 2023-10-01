import { InvalidFieldError } from "../../presentation/errors";
import {
  CreateUserServiceInterface,
  GetUserByEmailRepositoryInterface,
  UserDtoType,
  UserEntityType,
} from "../abstract";
import {
  HasherInterface,
  IdGeneratorInterface,
  CreateUserRepositoryInterface,
} from "../abstract";

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
    const newUser = await this.createUserRepository.create({
      ...userDto,
      id: id,
      password: hashedPassword,
    });

    return newUser;
  }
}
