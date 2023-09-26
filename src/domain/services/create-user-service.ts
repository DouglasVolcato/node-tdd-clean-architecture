import {
  CreateUserServiceInterface,
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
  private readonly idGenerator: IdGeneratorInterface;
  private readonly hasher: HasherInterface;

  public constructor(
    createUserRepository: CreateUserRepositoryInterface,
    idGenerator: IdGeneratorInterface,
    hasher: HasherInterface
  ) {
    this.createUserRepository = createUserRepository;
    this.idGenerator = idGenerator;
    this.hasher = hasher;
  }

  public async execute(userDto: UserDtoType): Promise<UserEntityType> {
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
