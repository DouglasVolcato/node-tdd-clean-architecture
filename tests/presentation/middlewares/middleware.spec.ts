import { ValidatorInterface } from "../../../src/presentation/protocols";
import {
  RequiredFieldError,
  ServerError,
} from "../../../src/presentation/errors";
import {
  MiddlewareStub,
  ValidatorStub,
  makeUserDto,
  throwError,
} from "../../test-helpers";

type SutTypes = {
  sut: MiddlewareStub;
  validatorStub: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const sut = new MiddlewareStub();
  (sut as any).validator = validatorStub;
  return { sut, validatorStub };
};

describe("Middleware", () => {
  it("Should call validator validation with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const compositeSpy = jest.spyOn(validatorStub, "validate");
    sut.execute(makeUserDto());

    expect(compositeSpy).toHaveBeenCalledTimes(1);
    expect(compositeSpy).toHaveBeenCalledWith(makeUserDto());
  });

  it("Should return a bad request if validator returns an error", async () => {
    const { sut, validatorStub } = makeSut();
    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new RequiredFieldError("any_field"));
    const response = await sut.execute(makeUserDto());

    expect(response).toEqual(new RequiredFieldError("any_field"));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest
      .spyOn(validatorStub, "validate")
      .mockImplementationOnce(() => throwError());
    const response = await sut.execute(makeUserDto());

    expect(response).toBeInstanceOf(ServerError);
  });
});
