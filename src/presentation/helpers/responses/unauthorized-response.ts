import { UnauthorizedError } from "../../../presentation/errors";
import { ControllerOutputType } from "../../../presentation/protocols";

export const unauthorized = (): ControllerOutputType<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});
