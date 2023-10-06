import { ValidatorInterface } from "../../../src/presentation/abstract";
import { RequiredFieldError } from "../../../src/presentation/errors";
import {
  ControllerStub,
  ValidatorStub,
  makeUserDto,
  throwError,
} from "../../../tests/test-helpers";

type SutTypes = {
  sut: ControllerStub;
  validatorStub: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const sut = new ControllerStub();
  (sut as any).validator = validatorStub;
  return { sut, validatorStub };
};

describe("Controller", () => {
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

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new RequiredFieldError("any_field"));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest
      .spyOn(validatorStub, "validate")
      .mockImplementationOnce(() => throwError());

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(Error);
  });
});
