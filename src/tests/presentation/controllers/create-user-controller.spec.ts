class RequiredFieldError extends Error {
  public constructor(fieldName: string) {
    super(`${fieldName} is missing`);
    this.name = "RequiredFieldError";
  }
}

interface ValidatorInterface {
  validate(): Error | undefined;
}

const badRequest = (error: Error): ControllerOutput<Error> => ({
  statusCode: 400,
  data: error,
});

class CreateUserController {
  private readonly validator: ValidatorInterface;

  public constructor(validator: ValidatorInterface) {
    this.validator = validator;
  }

  public async execute(
    request: ControllerInput<any>
  ): Promise<ControllerOutput<any> | any> {
    const error = this.validator.validate();

    if (error) {
      return badRequest(error);
    }
  }
}

type ControllerInput<T> = T;

type ControllerOutput<T> = {
  statusCode: number;
  data: T;
};

class ValidatorStub implements ValidatorInterface {
  validate(): Error | undefined {
    return;
  }
}

describe("CreateUserController", () => {
  it("Should call validator once", async () => {
    const validatorStub = new ValidatorStub();
    const sut = new CreateUserController(validatorStub);
    const validatorSpy = jest.spyOn(validatorStub, "validate");
    await sut.execute({});

    expect(validatorSpy).toBeCalledTimes(1);
  });

  it("Should return a bad request if validator returns an error", async () => {
    const validatorStub = new ValidatorStub();
    const sut = new CreateUserController(validatorStub);

    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new RequiredFieldError("any_field"));

    const response = await sut.execute({});

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new RequiredFieldError("any_field"));
  });
});
