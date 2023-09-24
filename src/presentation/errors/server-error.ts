export class ServerError extends Error {
  public constructor() {
    super(`Server error`);
    this.name = "ServerError";
  }
}
