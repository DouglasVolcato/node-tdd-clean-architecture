import { GetUserByTokenServiceInterface } from "../../../src/domain/protocols";
import { GetUserByTokenController } from "../../../src/presentation/controllers";
import { badRequest, ok } from "../../../src/presentation/helpers";
import {
  GetUserByTokenServiceStub,
  makeUserEntity,
  throwError,
} from "../../test-helpers";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../../src/presentation/errors";

const makeAuthenticatedRequest = () => {
  return { authorization: "Bearer any_token" };
};

type SutTypes = {
  sut: GetUserByTokenController;
  getUserByTokenServiceStub: GetUserByTokenServiceInterface;
};

const makeSut = (): SutTypes => {
  const getUserByTokenServiceStub = new GetUserByTokenServiceStub();
  const sut = new GetUserByTokenController(getUserByTokenServiceStub);
  return { sut, getUserByTokenServiceStub };
};

describe("GetUserByTokenController", () => {
  it("Should call GetUserByTokenService with correct token", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    const getUserByTokenServiceSpy = jest.spyOn(
      getUserByTokenServiceStub,
      "execute"
    );
    await sut.execute(request);

    expect(getUserByTokenServiceSpy).toHaveBeenCalledTimes(1);
    expect(getUserByTokenServiceSpy).toHaveBeenCalledWith("any_token");
  });

  it("Should return the found user", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const userData = makeUserEntity();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(userData));
    const output = await sut.execute(makeAuthenticatedRequest());

    expect(output).toEqual(ok(userData));
  });

  it("Should return a bad request if GetUserByTokenService returns undefined", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const output = await sut.execute(request);

    expect(output).toEqual(badRequest(new InvalidFieldError("authorization")));
  });

  it("Should return a server error if GetUserByTokenService throws", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(makeAuthenticatedRequest());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(Error);
  });

  it("Should return an error if GetUserByTokenService returns an error", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error("any_error")));
    const output = await sut.execute(request);

    expect(output).toEqual(badRequest(new InvalidFieldError("authorization")));
  });

  it("Should return an error if authorization is not provided", async () => {
    const { sut } = makeSut();
    const output = await sut.execute({});

    expect(output).toEqual(badRequest(new RequiredFieldError("authorization")));
  });
});
