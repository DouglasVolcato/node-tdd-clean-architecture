import { ServerError } from "../../../../src/presentation/errors";
import { serverError } from "../../../../src/presentation/helpers";

describe("serverError", () => {
  it("Data should be the default server error if no parameter is received", () => {
    const object = serverError();

    expect(object.data).toEqual(new ServerError());
  });

  it("Data should be the received error", () => {
    const error = new Error("any_error");
    const object = serverError(error);

    expect(object.data).toEqual(error);
  });
});
