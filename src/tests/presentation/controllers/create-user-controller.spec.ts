import {
  CreateUserServiceInterface,
  UserDtoType,
  UserEntityType,
} from "@/domain/abstract";
import { ValidatorInterface } from "@/presentation/abstract";
import { CreateUserController } from "@/presentation/controllers";
import { RequiredFieldError, ServerError } from "@/presentation/errors";
import { makeUserDto, makeUserEntity, throwError } from "@/tests/test-helpers";

class ValidatorStub implements ValidatorInterface {
  validate(): Error | undefined {
    return;
  }
}

class CreateUserServiceStub implements CreateUserServiceInterface {
  public async execute(userDto: UserDtoType): Promise<UserEntityType> {
    return makeUserEntity();
  }
}

type SutTypes = {
  sut: CreateUserController;
  validatorStub: ValidatorInterface;
  createUserServiceStub: CreateUserServiceInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const createUserServiceStub = new CreateUserServiceStub();
  const sut = new CreateUserController(validatorStub, createUserServiceStub);

  return { validatorStub, createUserServiceStub, sut };
};

describe("CreateUserController", () => {
  it("Should call validator once", async () => {
    const { sut, validatorStub } = makeSut();
    const validatorSpy = jest.spyOn(validatorStub, "validate");
    await sut.execute(makeUserDto());

    expect(validatorSpy).toBeCalledTimes(1);
  });

  it("Should return a bad request if validator returns an error", async () => {
    const { sut, validatorStub } = makeSut();
    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new RequiredFieldError("any_field"));
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new RequiredFieldError("any_field"));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest
      .spyOn(validatorStub, "validate")
      .mockImplementationOnce(() => throwError());

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(ServerError);
  });

  it("Should call create user service with correct values", async () => {
    const { sut, createUserServiceStub } = makeSut();
    const serviceSpy = jest.spyOn(createUserServiceStub, "execute");
    await sut.execute(makeUserDto());

    expect(serviceSpy).toHaveBeenCalledWith(makeUserDto());
    expect(serviceSpy).toBeCalledTimes(1);
  });

  it("Should return the new user created", async () => {
    const { sut, createUserServiceStub } = makeSut();
    jest
      .spyOn(createUserServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual(makeUserEntity());
  });

  it("Should return a server error if create user service throws", async () => {
    const { sut, createUserServiceStub } = makeSut();
    jest
      .spyOn(createUserServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(ServerError);
  });
});
