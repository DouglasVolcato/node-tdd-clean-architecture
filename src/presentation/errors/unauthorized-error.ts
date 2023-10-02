export class UnauthorizedError extends Error {
  public constructor() {
    super(`Unauthorized`);
    this.name = "UnauthorizedError";
  }
}
