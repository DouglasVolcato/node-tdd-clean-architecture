import { ValidatorComposite } from "../../../src/presentation/validators";
import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
  ValidatorInterface,
} from "../../../src/presentation/abstract";
import { Controller } from "../../../src/presentation/controllers/controller";
import {
  RequiredFieldError,
  ServerError,
} from "../../../src/presentation/errors";
import { ok } from "../../../src/presentation/helpers";
import { makeUserDto, throwError } from "../../../tests/test-helpers";

class ValidatorStub implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}

class ValidatorCompositeStub extends ValidatorComposite {}

class ControllerStub extends Controller implements ControllerInterface {
  public constructor() {
    super();
  }

  public async perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>> {
    return ok("any_data");
  }

  override buildValidators(): ValidatorInterface[] {
    return [new ValidatorStub()];
  }
}

type SutTypes = {
  sut: ControllerStub;
  validatorCompositeStub: ValidatorCompositeStub;
};

const makeSut = (): SutTypes => {
  const validatorCompositeStub = new ValidatorCompositeStub([]);
  const sut = new ControllerStub();
  (sut as any).validatorComposite = validatorCompositeStub;
  return { sut, validatorCompositeStub };
};

describe("Controller", () => {
  it("Should call validatorComposite validation with correct values", async () => {
    const { sut, validatorCompositeStub } = makeSut();
    const compositeSpy = jest.spyOn(validatorCompositeStub, "validate");
    sut.execute(makeUserDto());

    expect(compositeSpy).toHaveBeenCalledTimes(1);
    expect(compositeSpy).toHaveBeenCalledWith(makeUserDto());
  });

  it("Should return a bad request if validator returns an error", async () => {
    const { sut, validatorCompositeStub } = makeSut();
    jest
      .spyOn(validatorCompositeStub, "validate")
      .mockReturnValueOnce(new RequiredFieldError("any_field"));
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new RequiredFieldError("any_field"));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorCompositeStub } = makeSut();
    jest
      .spyOn(validatorCompositeStub, "validate")
      .mockImplementationOnce(() => throwError());

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(ServerError);
  });
});
