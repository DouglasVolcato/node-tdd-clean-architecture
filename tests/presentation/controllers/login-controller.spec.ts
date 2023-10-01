import {
  LoginDtoType,
  LoginServiceInterface,
} from "../../../src/domain/abstract";
import { LoginController } from "../../../src/presentation/controllers";
import { ValidatorComposite } from "../../../src/presentation/validators";
import { makeLoginDto } from "../../test-helpers/login-dto-helper";
import { throwError } from "../../test-helpers";
import { ServerError } from "../../../src/presentation/errors";

class LoginServiceStub implements LoginServiceInterface {
  public async execute(login: LoginDtoType): Promise<string | Error> {
    return Promise.resolve("valid_token");
  }
}

type SutTypes = {
  loginServiceStub: LoginServiceStub;
  sut: LoginController;
};

const makeSut = (): SutTypes => {
  const loginServiceStub = new LoginServiceStub();
  const sut = new LoginController(new ValidatorComposite(), loginServiceStub);
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

  it("Should return a server error if LoginService throws", async () => {
    const { sut, loginServiceStub } = makeSut();
    const loginDto = makeLoginDto();
    jest
      .spyOn(loginServiceStub, "execute")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(loginDto);

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(ServerError);
  });
});
