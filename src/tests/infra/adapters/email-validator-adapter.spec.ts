import { EmailValidatorAdapter } from "../../../infra/adapters";
import { throwError } from "../../../tests/test-helpers";
import { validate } from "email-validator";

jest.mock("email-validator", () => ({
  validate: jest.fn(),
}));

type SutTypes = {
  sut: EmailValidatorAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter();
  return { sut };
};

describe("EmailValidatorAdapter", () => {
  it("Should call validate with correct value", () => {
    const { sut } = makeSut();
    sut.isEmail("any_email");

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith("any_email");
  });

  it("Should return true if validate returns true", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockReturnValueOnce(true);
    const output = sut.isEmail("any_email");

    expect(output).toBeTruthy();
  });

  it("Should return false if validate returns false", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockReturnValueOnce(false);
    const output = sut.isEmail("any_email");

    expect(output).toBeFalsy();
  });

  it("Should throw if validate throws", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockImplementationOnce(() => throwError());

    expect(() => sut.isEmail("any_email")).toThrow();
  });
});
