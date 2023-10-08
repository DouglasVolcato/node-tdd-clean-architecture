export interface ErrorLogServiceInterface {
  execute(error: Error, content?: string): Promise<void>;
}
