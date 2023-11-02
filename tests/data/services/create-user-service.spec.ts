import { CreateUserUseCaseInterface } from "../../../src/domain/protocols";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { CreateUserService } from "../../../src/data/services";
import {
  GetUserByEmailRepositoryInterface,
  UserDtoType,
  HasherInterface,
  IdGeneratorInterface,
  CreateUserRepositoryInterface,
} from "../../../src/data/protocols";
import {
  CreateUserRepositoryStub,
  GetUserByEmailRepositoryStub,
  HasherStub,
  IdGeneratorStub,
  makeUserDto,
  makeUserEntity,
  throwError,
} from "../../test-helpers";

type SutTypes = {
  sut: CreateUserUseCaseInterface.Service;
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

    expect(error).toEqual(new InvalidFieldError("email"));
  });

  it("Should call idGenerator", async () => {
    const { sut, idGeneratorStub, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
    const idGeneratorSpy = jest.spyOn(idGeneratorStub, "generateId");
    await sut.execute(makeUserDto());

    expect(idGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call hasher with correct value", async () => {
    const { sut, hasherStub, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const userData = makeUserDto();
    await sut.execute(userData);

    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith(userData.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const {
      sut,
      createUserRepositoryStub,
      hasherStub,
      idGeneratorStub,
      getUserByEmailRepositoryStub,
    } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
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
    const { sut, createUserRepositoryStub, getUserByEmailRepositoryStub } =
      makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
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
    const { sut, idGeneratorStub, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(idGeneratorStub, "generateId")
      .mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if hasher throws", async () => {
    const { sut, hasherStub, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
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
    const { sut, createUserRepositoryStub, getUserByEmailRepositoryStub } =
      makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(createUserRepositoryStub, "create")
      .mockImplementationOnce(() => throwError());

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });
});
