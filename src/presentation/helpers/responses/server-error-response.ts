import { ControllerOutputType } from "../../../presentation/protocols";
import { ServerError } from "../../../presentation/errors";

export const serverError = (
  error = new ServerError()
): ControllerOutputType<Error> => ({
  statusCode: 500,
  data: error,
});
