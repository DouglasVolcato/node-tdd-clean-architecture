import { ErrorLogUseCaseInterface } from "../../domain/protocols";
import { FileWritterInterface } from "../../data/protocols";

export class ErrorLogService implements ErrorLogUseCaseInterface.Service {
  private readonly fileWritter: FileWritterInterface;

  public constructor(fileWritter: FileWritterInterface) {
    this.fileWritter = fileWritter;
  }

  public async execute({
    error,
    content,
  }: ErrorLogUseCaseInterface.Input): Promise<ErrorLogUseCaseInterface.Output> {
    const errorFilePath = "src/main/logs/error.log";
    const errorText = `\n${new Date().toLocaleString()} - ${error.message} - ${
      error.stack
    }\n${content || ""}`;
    return await this.fileWritter.writeInFile(errorFilePath, errorText);
  }
}
