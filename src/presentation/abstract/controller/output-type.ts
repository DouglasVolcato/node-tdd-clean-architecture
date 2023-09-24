export type ControllerOutputType<T> = {
  statusCode: number;
  data: T;
};
