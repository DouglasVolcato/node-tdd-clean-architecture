import { ControllerOutputType } from "../../../presentation/abstract";
import { ServerError } from "../../../presentation/errors";

export const serverError = (
  error = new ServerError()
): ControllerOutputType<Error> => ({
  statusCode: 500,
  data: error,
});
