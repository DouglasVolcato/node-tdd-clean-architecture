import { InvalidFieldError } from "../../../src/presentation/errors";
import {
  CreateUserServiceInterface,
  GetUserByEmailRepositoryInterface,
  UserDtoType,
  UserEntityType,
} from "../../../src/domain/abstract";
import {
  HasherInterface,
  IdGeneratorInterface,
  CreateUserRepositoryInterface,
} from "../../../src/domain/abstract";
import { CreateUserService } from "../../../src/domain/services";
import {
  makeUserDto,
  makeUserEntity,
  throwError,
} from "../../../tests/test-helpers";

class CreateUserRepositoryStub implements CreateUserRepositoryInterface {
  public async create(userDto: UserDtoType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}

class GetUserByEmailRepositoryStub
  implements GetUserByEmailRepositoryInterface
{
  public getByEmail(email: string): Promise<UserEntityType | undefined> {
    return
  }
}

class IdGeneratorStub implements IdGeneratorInterface {
  public generateId(): string {
    return "any_id";
  }
}

class HasherStub implements HasherInterface {
  public hash(value: string): string {
    return "hashed_value";
  }
}

type SutTypes = {
  sut: CreateUserServiceInterface;
  createUserRepositoryStub: CreateUserRepositoryInterface;
  getUserByEmailRepositoryStub: GetUserByEmailRepositoryInterface;
  idGeneratorStub: IdGeneratorInterface;
  hasherStub: HasherInterface;
};

const makeSut = (): SutTypes => {
  const createUserRepositoryStub = new CreateUserRepositoryStub();
  const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
  const idGeneratorStub = new IdGeneratorStub();
  const hasherStub = new HasherStub();
  const sut = new CreateUserService(
    createUserRepositoryStub,
    getUserByEmailRepositoryStub,
    idGeneratorStub,
    hasherStub
  );
  return {
    sut,
    createUserRepositoryStub,
    getUserByEmailRepositoryStub,
    idGeneratorStub,
    hasherStub,
  };
};

describe("CreateUserService", () => {
  it("Should call GetUserByEmailRepository with correct values", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const repositorySpy = jest.spyOn(
      getUserByEmailRepositoryStub,
      "getByEmail"
    );
    const userDto = makeUserDto();
    await sut.execute(makeUserDto());

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith(userDto.email);
  });

  it("Should return an error if GetUserByEmailRepository finds a user", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    const error = await sut.execute(makeUserDto());

    expect(error).toEqual(new InvalidFieldError("email already registered"));
  });

  it("Should call idGenerator", async () => {
    const { sut, idGeneratorStub } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorStub, "generateId");
    await sut.execute(makeUserDto());

    expect(idGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call hasher with correct value", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const userData = makeUserDto();
    await sut.execute(userData);

    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith(userData.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const { sut, createUserRepositoryStub, hasherStub, idGeneratorStub } =
      makeSut();
    const repositorySpy = jest.spyOn(createUserRepositoryStub, "create");
    const userEntity = makeUserEntity();
    const userDto: UserDtoType = {
      name: userEntity.name,
      email: userEntity.email,
      password: "not_hashed_password",
    };
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(userEntity.password);
    jest
      .spyOn(idGeneratorStub, "generateId")
      .mockReturnValueOnce(userEntity.id);
    await sut.execute(userDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith(userEntity);
  });

  it("Should return the same user entity CreateUserRepository returns", async () => {
    const { sut, createUserRepositoryStub } = makeSut();
    const userData = {
      id: "generated_id",
      email: "valid_email",
      name: "valid_name",
      password: "hashed_password",
    };
    jest
      .spyOn(createUserRepositoryStub, "create")
      .mockReturnValueOnce(Promise.resolve(userData));

    expect(await sut.execute(makeUserDto())).toEqual(userData);
  });

  it("Should throw if idGenerator throws", async () => {
    const { sut, idGeneratorStub } = makeSut();
    jest
      .spyOn(idGeneratorStub, "generateId")
      .mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if CreateUserRepository throws", async () => {
    const { sut, createUserRepositoryStub } = makeSut();
    jest
      .spyOn(createUserRepositoryStub, "create")
      .mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });
});
