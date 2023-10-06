import { GetUserByIdRepositoryStub } from "../../test-helpers/stubs/repositories/get-user-by-id-repository-stub";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { GetUserByTokenService } from "../../../src/domain/services";
import { Env } from "../../../src/main/config";
import {
  TokenDecrypterStub,
  makeUserEntity,
  throwError,
} from "../../test-helpers";
import {
  GetUserByIdRepositoryInterface,
  TokenDecrypterInterface,
} from "../../../src/domain/abstract";

const vars = new Env().getVariables();

type SutTypes = {
  sut: GetUserByTokenService;
  tokenValidatorStub: TokenDecrypterInterface;
  getUserByIdRepositoryStub: GetUserByIdRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const tokenValidatorStub = new TokenDecrypterStub();
  const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
  const sut = new GetUserByTokenService(
    tokenValidatorStub,
    getUserByIdRepositoryStub
  );
  return { sut, tokenValidatorStub, getUserByIdRepositoryStub };
};

describe("GetUserByTokenService", () => {
  it("Should call TokenDecrypter with correct token", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    const tokenValidatorSpy = jest.spyOn(tokenValidatorStub, "decryptToken");
    await sut.execute("any_token");

    expect(tokenValidatorSpy).toBeCalledTimes(1);
    expect(tokenValidatorSpy).toBeCalledWith("any_token", vars.SECRET);
  });

  it("Should throw if TokenDecrypter throws", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest
      .spyOn(tokenValidatorStub, "decryptToken")
      .mockImplementationOnce(() => throwError());
    expect(async () => await sut.execute("any_token")).rejects.toThrow();
  });

  it("Should return an error if TokenDecrypter returns undefined", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest
      .spyOn(tokenValidatorStub, "decryptToken")
      .mockReturnValueOnce(undefined);
    const error = await sut.execute("any_token");

    expect(error).toEqual(new InvalidFieldError("token"));
  });

  it("Should call GetUserByIdRepository with correct user id", async () => {
    const { sut, tokenValidatorStub, getUserByIdRepositoryStub } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepositoryStub,
      "getById"
    );
    jest
      .spyOn(tokenValidatorStub, "decryptToken")
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

  it("Should throw if TokenDecrypter throws", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    jest
      .spyOn(tokenValidatorStub, "decryptToken")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute("any_token")).rejects.toThrow();
  });
});
