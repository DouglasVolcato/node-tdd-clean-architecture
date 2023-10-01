import {
  CreateUserServiceInterface,
  UserDtoType,
  UserEntityType,
} from "../../../src/domain/abstract";
import {
  ValidatorCompositeInterface,
  ValidatorInterface,
} from "../../../src/presentation/abstract";
import { CreateUserController } from "../../../src/presentation/controllers";
import { ServerError } from "../../../src/presentation/errors";
import {
  makeUserDto,
  makeUserEntity,
  throwError,
} from "../../../tests/test-helpers";

class CreateUserServiceStub implements CreateUserServiceInterface {
  public async execute(userDto: UserDtoType): Promise<UserEntityType> {
    return makeUserEntity();
  }
}

class ValidatorCompositeStub implements ValidatorCompositeInterface {
  public setValidators(validators: ValidatorInterface[]): void {}
  public validate(request: any): Error | undefined {
    return;
  }
}

type SutTypes = {
  sut: CreateUserController;
  createUserServiceStub: CreateUserServiceInterface;
};

const makeSut = (): SutTypes => {
  const createUserServiceStub = new CreateUserServiceStub();
  const sut = new CreateUserController(
    createUserServiceStub,
    new ValidatorCompositeStub()
  );

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

  it("Should return a server error if CreateUserService throws", async () => {
    const { sut, createUserServiceStub } = makeSut();
    jest
      .spyOn(createUserServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(ServerError);
  });
});
