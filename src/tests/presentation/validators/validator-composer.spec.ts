import { ValidatorInterface } from "@/presentation/abstract";
import { makeUserDto } from "@/tests/test-helpers";

class ValidatorComposer implements ValidatorInterface {
  private readonly validators: ValidatorInterface[];

  public constructor(validators: ValidatorInterface[]) {
    this.validators = validators;
  }

  public validate(request: any): Error | undefined {
    for (const validator of this.validators) {
      validator.validate(request);
    }
    return;
  }
}

const makeRequest = () => makeUserDto();

class ValidatorStub1 implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}

class ValidatorStub2 implements ValidatorInterface {
  public validate(request: any): Error | undefined {
    return;
  }
}

type SutTypes = {
  sut: ValidatorComposer;
  validatorStub1: ValidatorStub1;
  validatorStub2: ValidatorStub2;
};

const makeSut = (): SutTypes => {
  const validatorStub1 = new ValidatorStub1();
  const validatorStub2 = new ValidatorStub2();
  const validatorStubs = [validatorStub1, validatorStub2];
  const sut = new ValidatorComposer(validatorStubs);
  return { validatorStub1, validatorStub2, sut };
};

describe("ValidatorComposer", () => {
  it("Validate should call validators with correct values", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();
    const validatorStubSpy1 = jest.spyOn(validatorStub1, "validate");
    const validatorStubSpy2 = jest.spyOn(validatorStub2, "validate");
    sut.validate(makeRequest());

    expect(validatorStubSpy1).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy1).toHaveBeenCalledWith(makeRequest());
    expect(validatorStubSpy2).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy2).toHaveBeenCalledWith(makeRequest());
  });

  it('Should return undefined', () => {
    const { sut} = makeSut();
    const output = sut.validate(makeRequest());

    expect(output).toBeUndefined();
  })
});
