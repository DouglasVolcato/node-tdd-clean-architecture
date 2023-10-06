import { ValidatorComposite } from "../../../src/presentation/validators/validator-composite";
import { ValidatorStub, makeUserDto } from "../../../tests/test-helpers";
import { ValidatorInterface } from "../../../src/presentation/abstract";

type SutTypes = {
  sut: ValidatorComposite;
  validatorStub1: ValidatorInterface;
  validatorStub2: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub1 = new ValidatorStub();
  const validatorStub2 = new ValidatorStub();
  const validatorStubs = [validatorStub1, validatorStub2];
  const sut = new ValidatorComposite(validatorStubs);
  return { validatorStub1, validatorStub2, sut };
};
const makeRequest = () => makeUserDto();

describe("ValidatorComposite", () => {
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

  it("Validate should return an error if a validator returns an error", () => {
    const { sut, validatorStub1 } = makeSut();
    jest
      .spyOn(validatorStub1, "validate")
      .mockReturnValueOnce(new Error("any_error"));
    const error = sut.validate(makeRequest());

    expect(error).toEqual(new Error("any_error"));
  });

  it("Validate should return undefined", () => {
    const { sut } = makeSut();
    const output = sut.validate(makeRequest());

    expect(output).toBeUndefined();
  });

  it("SetValidators should set the validators property", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();

    expect((sut as any).validators).toEqual([validatorStub1, validatorStub2]);
  });
});
