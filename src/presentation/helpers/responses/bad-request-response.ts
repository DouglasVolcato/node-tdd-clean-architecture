import { ControllerOutputType } from "../../../presentation/protocols";

export const badRequest = (error: Error): ControllerOutputType<Error> => ({
  statusCode: 400,
  data: error,
});
