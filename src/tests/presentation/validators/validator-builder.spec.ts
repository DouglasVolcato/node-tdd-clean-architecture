import { ValidatorInterface } from "@/presentation/abstract";

class ValidatorBuilder implements ValidatorInterface {
  private requiredFields: string[] = [];

  public validate(request: any): Error | undefined {
    throw new Error("Method not implemented.");
  }

  public isRequired(fieldName: string): void {
    this.requiredFields.push(fieldName);
  }

}

describe("ValidatorBuilder", () => {
  it("Should add new required field names by calling isRequired", () => {
    const sut = new ValidatorBuilder();
    const addRequiredFieldSpy = jest.spyOn(sut, "isRequired");
    sut.isRequired("required_field");

    expect((sut as any).requiredFields).toContain("required_field");
    expect(addRequiredFieldSpy).toBeCalledTimes(1);
  });

  it("Should add multiple field names by calling isRequired multiple times", () => {
    const sut = new ValidatorBuilder();
    const addRequiredFieldSpy = jest.spyOn(sut, "isRequired");
    sut.isRequired("required_field_1");
    sut.isRequired("required_field_2");

    expect((sut as any).requiredFields).toContain("required_field_1");
    expect((sut as any).requiredFields).toContain("required_field_2");
    expect(addRequiredFieldSpy).toBeCalledTimes(2);
  });
});
