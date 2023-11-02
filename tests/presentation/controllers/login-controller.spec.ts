import { LoginController } from "../../../src/presentation/controllers";
import { makeLoginDto } from "../../test-helpers/dtos/login-dto";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { LoginUseCaseInterface } from "../../../src/domain/protocols";
import {
  LoginServiceStub,
  ValidatorStub,
  throwError,
} from "../../test-helpers";

type SutTypes = {
  loginServiceStub: LoginUseCaseInterface.Service;
  sut: LoginController;
};

const makeSut = (): SutTypes => {
  const loginServiceStub = new LoginServiceStub();
  const sut = new LoginController(loginServiceStub);
  (sut as any).validator = new ValidatorStub();
  return { sut, loginServiceStub };
};

describe("LoginController", () => {
  it("Should call LoginService with correct valus", async () => {
    const { sut, loginServiceStub } = makeSut();
    const loginDto = makeLoginDto();
    const serviceSpy = jest.spyOn(loginServiceStub, "execute");
    await sut.execute(loginDto);

    expect(serviceSpy).toBeCalledTimes(1);
    expect(serviceSpy).toHaveBeenCalledWith(loginDto);
  });

  it("Should return the generated token", async () => {
    const { sut } = makeSut();
    const loginDto = makeLoginDto();
    const response = await sut.execute(loginDto);

    expect(response.statusCode).toEqual(200);
    expect(response.data).toEqual({ token: "valid_token" });
  });

  it("Should return an error if LoginService returns an error", async () => {
    const { sut, loginServiceStub } = makeSut();
    const loginDto = makeLoginDto();
    jest
      .spyOn(loginServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(new InvalidFieldError("email")));
    const response = await sut.execute(loginDto);

    expect(response.statusCode).toBe(400);
    expect(response.data).toBeInstanceOf(InvalidFieldError);
  });

  it("Should return a server error if LoginService throws", async () => {
    const { sut, loginServiceStub } = makeSut();
    const loginDto = makeLoginDto();
    jest
      .spyOn(loginServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(loginDto);

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(Error);
  });
});
