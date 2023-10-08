export interface ErrorLogServiceInterface {
  execute(error: Error): Promise<void>;
}
