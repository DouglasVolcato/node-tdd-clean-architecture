import { ControllerOutputType } from "../../../presentation/abstract";

export const ok = (data: any): ControllerOutputType<any> => ({
  statusCode: 200,
  data: data,
});
