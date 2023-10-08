import { ControllerOutputType } from "../../../presentation/protocols";

export const ok = (data: any): ControllerOutputType<any> => ({
  statusCode: 200,
  data: data,
});
