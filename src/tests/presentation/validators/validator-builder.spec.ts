import {
  EmailValidatorInterface,
  ValidatorBuilderInterface,
} from "@/presentation/abstract";
import { InvalidFieldError, RequiredFieldError } from "@/presentation/errors";
import { ValidatorBuilder } from "@/presentation/validators";
import { throwError } from "@/tests/test-helpers";

class EmailValidatorStub implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return true;
  }
}

type SutTypes = {
  sut: ValidatorBuilderInterface;
  emailValidatorStub: EmailValidatorInterface;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new ValidatorBuilder();
  (sut as any ).emailValidator = emailValidatorStub;

  return { emailValidatorStub, sut };
};

describe("ValidatorBuilder", () => {
  it("Of should return a validator", () => {
    const { sut } = makeSut();
    const output = sut.of("requiredField");

    expect(output).toBeInstanceOf(ValidatorBuilder);
  });

  it("Of should set the field name", () => {
    const { sut } = makeSut();
    sut.of("requiredField");

    expect((sut as any).fieldName).toContain("requiredField");
  });

  it("Of should reset the object", () => {
    const { sut } = makeSut();
    (sut as any).fieldName = "any_field";
    (sut as any).validateRequired = true;
    (sut as any).validateEmail = true;

    sut.of("requiredField");

    expect((sut as any).fieldName).toBe("requiredField");
    expect((sut as any).validateRequired).toBeFalsy();
    expect((sut as any).validateEmail).toBeFalsy();
  });

  it("IsRequired should return a validator", () => {
    const { sut } = makeSut();
    const output = sut.of("requiredField").isRequired();

    expect(output).toBeInstanceOf(ValidatorBuilder);
  });

  it("IsRequired should set the validateRequired to true", () => {
    const { sut } = makeSut();
    sut.of("requiredField").isRequired();

    expect((sut as any).validateRequired).toBeTruthy();
  });

  it("IsEmail should return a validator", () => {
    const { sut } = makeSut();
    const output = sut.of("requiredField").isEmail();

    expect(output).toBeInstanceOf(ValidatorBuilder);
  });

  it("IsEmail should set the validateEmail to true", () => {
    const { sut } = makeSut();
    sut.of("requiredField").isEmail();

    expect((sut as any).validateEmail).toBeTruthy();
  });

  it("Validate should return undefined", () => {
    const { sut } = makeSut();
    sut.of("requiredField1").isRequired();
    const output = sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
    });

    expect(output).toBeUndefined();
  });

  it("Validate should return undefined if name is empty", () => {
    const { sut } = makeSut();
    sut.of("").isRequired();
    const output = sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
    });

    expect(output).toBeUndefined();
  });

  it("Validate should return undefined if it is not validating anything", () => {
    const { sut } = makeSut();
    sut.of("any_field").isRequired();
    (sut as any).validateRequired = false;
    (sut as any).validateEmail = false;
    const output = sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
    });

    expect(output).toBeUndefined();
  });

  it("Validate should return an error if required field is missing", () => {
    const { sut } = makeSut();
    sut.of("requiredField").isRequired();
    const error = sut.validate({
      notRequiredField1: "any_value",
    });

    expect(error).toEqual(new RequiredFieldError("requiredField"));
  });

  it("Validate should not call email validator if validateEmail is false", () => {
    const { emailValidatorStub, sut } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isEmail");
    sut.of("emailField").isRequired();
    sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
      emailField: "any_email@email.com",
    });

    expect((sut as any).validateEmail).toBeFalsy();
    expect(emailValidatorSpy).toHaveBeenCalledTimes(0);
  });

  it("Validate should call email validator with correct value", () => {
    const { emailValidatorStub, sut } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isEmail");
    sut.of("emailField").isEmail();
    sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
      emailField: "any_email@email.com",
    });

    expect(emailValidatorSpy).not.toHaveBeenCalledWith("requiredField1");
    expect(emailValidatorSpy).not.toHaveBeenCalledWith("requiredField2");
    expect(emailValidatorSpy).toHaveBeenCalledWith("emailField");
    expect((sut as any).validateEmail).toBeTruthy();
    expect(emailValidatorSpy).toHaveBeenCalledTimes(1);
  });

  it("Validate should return an error if email validation fails", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isEmail")
      .mockImplementationOnce(() => false);
    sut.of("emailField").isEmail();
    const error = sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
      emailField: "invalid_email",
    });

    expect(error).toEqual(new InvalidFieldError("emailField"));
  });

  it("Validate should return an error if email field is missing", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isEmail")
      .mockImplementationOnce(() => false);
    sut.of("emailField").isEmail();
    const error = sut.validate({});

    expect(error).toEqual(new RequiredFieldError("emailField"));
  });

  it("Validate should throw if email validator throws", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isEmail")
      .mockImplementationOnce(() => throwError());
    sut.of("emailField").isEmail();

    expect(() =>
      sut.validate({
        requiredField1: "any_value",
        requiredField2: "any_value",
        emailField: "any_email@email.com",
      })
    ).toThrow();
  });
});
