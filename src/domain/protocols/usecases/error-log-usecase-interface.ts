export namespace ErrorLogUseCaseInterface {
  export interface Service {
    execute(input: Input): Promise<Output>;
  }

  export type Input = {
    error: Error;
    content?: string;
  };

  export type Output = void;
}
