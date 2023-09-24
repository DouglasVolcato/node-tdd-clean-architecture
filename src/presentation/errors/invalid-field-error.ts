export class InvalidFieldError extends Error {
  public constructor(fieldName: string) {
    super(`${fieldName} is invalid`);
    this.name = "InvalidFieldError";
  }
}
