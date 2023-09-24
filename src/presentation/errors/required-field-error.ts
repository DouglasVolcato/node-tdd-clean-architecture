export class RequiredFieldError extends Error {
  public constructor(fieldName: string) {
    super(`${fieldName} is missing`);
    this.name = "RequiredFieldError";
  }
}
