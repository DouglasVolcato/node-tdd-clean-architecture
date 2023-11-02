import { GetUserByTokenUseCaseInterface } from "../../../src/domain/protocols";
import { UserAuthMiddleware } from "../../../src/presentation/middlewares";
import {
  GetUserByTokenServiceStub,
  makeUserEntity,
  throwError,
} from "../../test-helpers";
import {
  RequiredFieldError,
  ServerError,
  UnauthorizedError,
} from "../../../src/presentation/errors";

const makeAuthenticatedRequest = () => {
  return { authorization: "Bearer any_token" };
};

type SutTypes = {
  sut: UserAuthMiddleware;
  getUserByTokenServiceStub: GetUserByTokenUseCaseInterface.Service;
};

const makeSut = (): SutTypes => {
  const getUserByTokenServiceStub = new GetUserByTokenServiceStub();
  const sut = new UserAuthMiddleware(getUserByTokenServiceStub);
  return { sut, getUserByTokenServiceStub };
};

describe("UserAuthMiddleware", () => {
  it("Should call GetUserByTokenService with correct token", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    const getUserByTokenServiceSpy = jest.spyOn(
      getUserByTokenServiceStub,
      "execute"
    );
    await sut.execute(request);

    expect(getUserByTokenServiceSpy).toHaveBeenCalledTimes(1);
    expect(getUserByTokenServiceSpy).toHaveBeenCalledWith({
      token: "any_token",
    });
  });

  it("Should return the found user", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const userData = makeUserEntity();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(userData));
    const output = await sut.execute(makeAuthenticatedRequest());

    expect(output).toEqual({ user: userData });
  });

  it("Should return an error if GetUserByTokenService returns undefined", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const output = await sut.execute(request);

    expect(output).toEqual(new UnauthorizedError());
  });

  it("Should return an error if GetUserByTokenService throws", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const output = await sut.execute(makeAuthenticatedRequest());

    expect(output).toEqual(new ServerError());
  });

  it("Should return an error if authorization is not provided", async () => {
    const { sut } = makeSut();
    const output = await sut.execute({});

    expect(output).toEqual(new RequiredFieldError("authorization"));
  });

  it("Should return an error if authorization is invalid", async () => {
    const { sut } = makeSut();
    const output = await sut.execute({ authorization: "invalid_auth" });

    expect(output).toEqual(new UnauthorizedError());
  });
});
