import { ControllerOutputType } from "../../../presentation/abstract";
import { ServerError } from "../../../presentation/errors";

export const serverError = (): ControllerOutputType<Error> => ({
  statusCode: 500,
  data: new ServerError(),
});
