import { ControllerOutputType } from "@/presentation/abstract";

export const badRequest = (error: Error): ControllerOutputType<Error> => ({
  statusCode: 400,
  data: error,
});
