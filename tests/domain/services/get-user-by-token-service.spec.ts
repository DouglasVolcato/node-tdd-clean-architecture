import {
  GetUserByIdRepositoryInterface,
  TokenValidatorInterface,
  UserEntityType,
} from "../../../src/domain/abstract";
import { makeUserEntity, throwError } from "../../test-helpers";
import { Env } from "../../../src/main/config";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { GetUserByTokenService } from "../../../src/domain/services";

const vars = new Env().getVariables();

class TokenValidatorStub implements TokenValidatorInterface {
  public validateToken(token: string, secret: string): string {
    return "any_key";
  }
}

class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
  public async getById(id: string): Promise<UserEntityType | undefined> {
    return Promise.resolve(makeUserEntity());
  }
}

type SutTypes = {
  sut: GetUserByTokenService;
  tokenValidatorStub: TokenValidatorInterface;
  getUserByIdRepositoryStub: GetUserByIdRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const tokenValidatorStub = new TokenValidatorStub();
  const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
  const sut = new GetUserByTokenService(
    tokenValidatorStub,
    getUserByIdRepositoryStub
  );
  return { sut, tokenValidatorStub, getUserByIdRepositoryStub };
};

describe("GetUserByTokenService", () => {
  it("Should call TokenValidator with correct token", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    const tokenValidatorSpy = jest.spyOn(tokenValidatorStub, "validateToken");
    await sut.execute("any_token");

    expect(tokenValidatorSpy).toBeCalledTimes(1);
    expect(tokenValidatorSpy).toBeCalledWith("any_token", vars.SECRET);
  });

  it("Should throw if TokenValidator throws", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest
      .spyOn(tokenValidatorStub, "validateToken")
      .mockImplementationOnce(() => throwError());
    expect(async () => await sut.execute("any_token")).rejects.toThrow();
  });

  it("Should call GetUserByIdRepository with correct user id", async () => {
    const { sut, tokenValidatorStub, getUserByIdRepositoryStub } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepositoryStub,
      "getById"
    );
    jest
      .spyOn(tokenValidatorStub, "validateToken")
      .mockReturnValueOnce("valid_user_id");
    await sut.execute("any_token");

    expect(getUserByIdRepositorySpy).toBeCalledTimes(1);
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should return an error if GetUserByIdRepository returns undefined", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByIdRepositoryStub, "getById")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute("any_token");

    expect(error).toEqual(new InvalidFieldError("token"));
  });

  it("Should return the found user", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const userData = makeUserEntity();
    jest
      .spyOn(getUserByIdRepositoryStub, "getById")
      .mockReturnValueOnce(Promise.resolve(userData));
    const user = await sut.execute("any_token");

    expect(user).toEqual(userData);
  });

  it("Should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByIdRepositoryStub, "getById")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute("any_token")).rejects.toThrow();
  });

  it("Should throw if TokenValidator throws", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest
      .spyOn(tokenValidatorStub, "validateToken")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute("any_token")).rejects.toThrow();
  });
});
