import { CreateUserController } from "../../../src/presentation/controllers";
import { CreateUserServiceInterface } from "../../../src/domain/abstract";
import { InvalidFieldError } from "../../../src/presentation/errors";
import {
  CreateUserServiceStub,
  ValidatorStub,
  makeUserDto,
  makeUserEntity,
  throwError,
} from "../../../tests/test-helpers";

type SutTypes = {
  sut: CreateUserController;
  createUserServiceStub: CreateUserServiceInterface;
};

const makeSut = (): SutTypes => {
  const createUserServiceStub = new CreateUserServiceStub();
  const sut = new CreateUserController(createUserServiceStub);
  (sut as any).validator = new ValidatorStub();

  return { createUserServiceStub, sut };
};

describe("CreateUserController", () => {
  it("Should call CreateUserService with correct values", async () => {
    const { sut, createUserServiceStub } = makeSut();
    const userDto = makeUserDto();
    const serviceSpy = jest.spyOn(createUserServiceStub, "execute");
    await sut.execute(userDto);

    expect(serviceSpy).toHaveBeenCalledWith(userDto);
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

  it("Should return an error if CreateUserService returns an error", async () => {
    const { sut, createUserServiceStub } = makeSut();
    jest
      .spyOn(createUserServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(new InvalidFieldError("email")));
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(400);
    expect(response.data).toBeInstanceOf(InvalidFieldError);
  });

  it("Should return a server error if CreateUserService throws", async () => {
    const { sut, createUserServiceStub } = makeSut();
    jest
      .spyOn(createUserServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(Error);
  });
});
