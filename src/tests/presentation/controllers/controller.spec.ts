import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
  ValidatorCompositeInterface,
  ValidatorInterface,
} from "@/presentation/abstract";
import { Controller } from "@/presentation/controllers/controller";
import { RequiredFieldError, ServerError } from "@/presentation/errors";
import { ok } from "@/presentation/helpers";
import { makeUserDto, throwError } from "@/tests/test-helpers";

class ValidatorStub implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}

class ValidatorCompositeStub implements ValidatorCompositeInterface {
  public setValidators(validators: ValidatorInterface[]): void {}
  public validate(request: any): Error | undefined {
    return;
  }
}

class ControllerStub extends Controller implements ControllerInterface {
  public constructor(validatorComposite: ValidatorCompositeInterface) {
    super(validatorComposite);
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
  const validatorCompositeStub = new ValidatorCompositeStub();
  const sut = new ControllerStub(validatorCompositeStub);
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

  it("Should call validatorComposite setValidators with correct values", async () => {
    const { sut, validatorCompositeStub } = makeSut();
    const compositeSpy = jest.spyOn(validatorCompositeStub, "setValidators");
    sut.execute(makeUserDto());

    expect(compositeSpy).toHaveBeenCalledTimes(1);
    expect(compositeSpy).toHaveBeenCalledWith([new ValidatorStub()]);
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
