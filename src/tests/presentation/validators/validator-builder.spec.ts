import { ValidatorInterface } from "@/presentation/abstract";
import { RequiredFieldError } from "@/presentation/errors";

class ValidatorBuilder implements ValidatorInterface {
  private requiredFields: string[] = [];
  private emailFields: string[] = [];

  public validate(request: any): Error | undefined {
    for (const field of this.requiredFields) {
      if (!(field in request)) {
        return new RequiredFieldError(field);
      }
    }

    return;
  }

  public isRequired(fieldName: string): void {
    this.requiredFields.push(fieldName);
  }

  public isEmail(fieldName: string): void {
    this.emailFields.push(fieldName);
  }
}

describe("ValidatorBuilder", () => {
  it("Should add multiple field names by calling isRequired multiple times", () => {
    const sut = new ValidatorBuilder();
    const isRequiredSpy = jest.spyOn(sut, "isRequired");
    sut.isRequired("required_field_1");
    sut.isRequired("required_field_2");

    expect((sut as any).requiredFields).toContain("required_field_1");
    expect((sut as any).requiredFields).toContain("required_field_2");
    expect(isRequiredSpy).toBeCalledTimes(2);
  });

  it("Should add multiple email field names by calling isEmail multiple times", () => {
    const sut = new ValidatorBuilder();
    const isEmailSpy = jest.spyOn(sut, "isEmail");
    sut.isEmail("email_field_1");
    sut.isEmail("email_field_2");

    expect((sut as any).emailFields).toContain("email_field_1");
    expect((sut as any).emailFields).toContain("email_field_2");
    expect(isEmailSpy).toBeCalledTimes(2);
  });

  it("Should return an error if required field is missing", () => {
    const sut = new ValidatorBuilder();
    sut.isRequired("requiredField");
    const error = sut.validate({
      notRequiredField1: "any_value"
    });

    expect(error).toEqual(new RequiredFieldError("requiredField"));
  });
});