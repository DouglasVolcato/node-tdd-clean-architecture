import { EmailValidatorInterface, ValidatorBuilderInterface } from "@/presentation/abstract";
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
  const sut = new ValidatorBuilder(emailValidatorStub);

  return { emailValidatorStub, sut };
};

describe("ValidatorBuilder", () => {
  it("IsRequired should add multiple field names", () => {
    const { sut } = makeSut();
    const isRequiredSpy = jest.spyOn(sut, "isRequired");
    const output = sut.isEmail("requiredField");

    expect(output).toBeInstanceOf(ValidatorBuilder);
    expect(isRequiredSpy).toBeCalledTimes(1);
  });

  it("IsRequired should add multiple field names", () => {
    const { sut } = makeSut();
    const isRequiredSpy = jest.spyOn(sut, "isRequired");
    sut.isRequired("required_field_1");
    sut.isRequired("required_field_2");

    expect((sut as any).requiredFields).toContain("required_field_1");
    expect((sut as any).requiredFields).toContain("required_field_2");
    expect(isRequiredSpy).toBeCalledTimes(2);
  });

  it("IsEmail should return an instance of the class", () => {
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(sut, "isEmail");
    const output = sut.isEmail("emailField");

    expect(output).toBeInstanceOf(ValidatorBuilder);
    expect(isEmailSpy).toBeCalledTimes(1);
  });

  it("IsEmail should add multiple field names", () => {
    const { sut } = makeSut();
    const isRequiredSpy = jest.spyOn(sut, "isRequired");
    sut.isEmail("emailField1");
    sut.isEmail("emailField2");

    expect((sut as any).requiredFields).toContain("emailField1");
    expect((sut as any).requiredFields).toContain("emailField2");
    expect(isRequiredSpy).toBeCalledTimes(2);
  });

  it("IsEmail should add multiple email field names", () => {
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(sut, "isEmail");
    sut.isEmail("emailField1");
    sut.isEmail("emailField2");

    expect((sut as any).emailFields).toContain("emailField1");
    expect((sut as any).emailFields).toContain("emailField2");
    expect(isEmailSpy).toBeCalledTimes(2);
  });

  it("Should return undefined", () => {
    const { sut } = makeSut();
    sut.isRequired("requiredField1");
    sut.isRequired("requiredField2");
    sut.isEmail("requiredField1");
    sut.isEmail("requiredField2");
    const output = sut.validate({
      requiredField1: "any_value",
      requiredField2: "any_value",
    });

    expect(output).toBeUndefined();
  });

  it("Validate should return an error if required field is missing", () => {
    const { sut } = makeSut();
    sut.isRequired("requiredField");
    const error = sut.validate({
      notRequiredField1: "any_value",
    });

    expect(error).toEqual(new RequiredFieldError("requiredField"));
  });

  it("Validate should call email validator with correct value", () => {
    const { emailValidatorStub, sut } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isEmail");
    sut.isRequired("requiredField1");
    sut.isRequired("requiredField2");
    sut.isEmail("emailField1");
    sut.isEmail("emailField2");
    sut.validate({
      requiredField1: "any_valud",
      requiredField2: "any_valud",
      emailField1: "any_email@email.com",
      emailField2: "any_email@email.com",
    });

    expect(emailValidatorSpy).not.toHaveBeenCalledWith("requiredField1");
    expect(emailValidatorSpy).not.toHaveBeenCalledWith("requiredField2");
    expect(emailValidatorSpy).toHaveBeenCalledWith("emailField1");
    expect(emailValidatorSpy).toHaveBeenCalledWith("emailField2");
    expect(emailValidatorSpy).toHaveBeenCalledTimes(2);
  });

  it("Validate should return an error if email validation fails", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isEmail")
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false);
    sut.isEmail("emailField1");
    sut.isEmail("emailField2");
    const error = sut.validate({
      emailField1: "any_email@email.com",
      emailField2: "invalid_email",
    });

    expect(error).toEqual(new InvalidFieldError("emailField2"));
  });

  it("Validate should throw if email validator throws", () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isEmail")
      .mockImplementationOnce(() => throwError());
    sut.isEmail("emailField");

    expect(() =>
      sut.validate({
        emailField: "any_email@email.com",
      })
    ).toThrow();
  });
});
