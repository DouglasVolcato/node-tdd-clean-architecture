import {
  GetUserByEmailRepositoryInterface,
  UserEntityType,
  TokenGeneratorInterface,
  HashValidatorInterface,
} from "../../../src/domain/abstract";
import { makeUserEntity, throwError } from "../../test-helpers";
import { Env } from "../../../src/main/config";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { LoginService } from "../../../src/domain/services/login-service";
import { makeLoginDto } from "../../test-helpers/dtos/login-dto-helper";

class GetUserByEmailRepositoryStub
  implements GetUserByEmailRepositoryInterface
{
  public async getByEmail(email: string): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}

class HashValidatorStub implements HashValidatorInterface {
  public validate(value: string, hashedValue: string): boolean {
    return true;
  }
}

class TokenGeneratorStub implements TokenGeneratorInterface {
  public generateToken(content: any, secret: string): string {
    return "generated_token";
  }
}

const vars = new Env().getVariables();

type SutTypes = {
  sut: LoginService;
  getUserByEmailRepositoryStub: GetUserByEmailRepositoryStub;
  hashValidatorStub: HashValidatorStub;
  tokenGeneratorStub: TokenGeneratorStub;
};

const makeSut = (): SutTypes => {
  const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
  const hashValidatorStub = new HashValidatorStub();
  const tokenGeneratorStub = new TokenGeneratorStub();
  const sut = new LoginService(
    getUserByEmailRepositoryStub,
    hashValidatorStub,
    tokenGeneratorStub
  );
  return {
    sut,
    getUserByEmailRepositoryStub,
    hashValidatorStub,
    tokenGeneratorStub,
  };
};

describe("LoginService", () => {
  it("Should call GetUserByEmailRepository with received email", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const loginDto = makeLoginDto();
    const repositorySpy = jest.spyOn(
      getUserByEmailRepositoryStub,
      "getByEmail"
    );
    await sut.execute(loginDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith(loginDto.email);
  });

  it("Should call HashValidator with correct values", async () => {
    const { sut, hashValidatorStub } = makeSut();
    const loginDto = makeLoginDto();
    const hashValidatorSpy = jest.spyOn(hashValidatorStub, "validate");
    await sut.execute(loginDto);

    expect(hashValidatorSpy).toHaveBeenCalledTimes(1);
    expect(hashValidatorSpy).toHaveBeenCalledWith(
      loginDto.password,
      makeUserEntity().password
    );
  });

  it("Should call TokenGenerator with correct values", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const loginDto = makeLoginDto();
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, "generateToken");
    await sut.execute(loginDto);

    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
    expect(tokenGeneratorSpy).toHaveBeenCalledWith(
      { id: makeUserEntity().id },
      vars.SECRET
    );
  });

  it("Should return generated token", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const loginDto = makeLoginDto();
    jest
      .spyOn(tokenGeneratorStub, "generateToken")
      .mockReturnValueOnce("new_generated_token");
    const token = await sut.execute(loginDto);

    expect(token).toBe("new_generated_token");
  });

  it("Should return an error if user was not found", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const loginDto = makeLoginDto();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockReturnValueOnce(undefined);
    const error = await sut.execute(loginDto);

    expect(error).toEqual(new InvalidFieldError("email"));
  });

  it("Should return an error if password is invalid", async () => {
    const { sut, hashValidatorStub } = makeSut();
    const loginDto = makeLoginDto();
    jest.spyOn(hashValidatorStub, "validate").mockReturnValueOnce(false);
    const error = await sut.execute(loginDto);

    expect(error).toEqual(new InvalidFieldError("password"));
  });

  it("Should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, "getByEmail")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });

  it("Should throw if HashValidator throws", async () => {
    const { sut, hashValidatorStub } = makeSut();
    jest
      .spyOn(hashValidatorStub, "validate")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });

  it("Should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generateToken")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });
});
