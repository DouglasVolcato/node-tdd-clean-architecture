import {
  ErrorLogServiceInterface,
  FileWritterInterface,
} from "../../../src/domain/abstract";
import { ErrorLogService } from "../../../src/domain/services";
import { throwError } from "../../test-helpers";

const error = new Error("any_error");
const errorFilePath = "src/main/logs/error.log";
const errorText = `\n${new Date().toLocaleString()} - ${error.message} - ${
  error.stack
}`;

class FileWritterStub implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    return;
  }
}

type SutTypes = {
  sut: ErrorLogServiceInterface;
  fileWritterStub: FileWritterInterface;
};

const makeSut = (): SutTypes => {
  const fileWritterStub = new FileWritterStub();
  const sut = new ErrorLogService(fileWritterStub);
  return { sut, fileWritterStub };
};

describe("ErrorLogService", () => {
  it("Should call FileWritter with correct values", async () => {
    const { sut, fileWritterStub } = makeSut();
    const fileWritterSpy = jest.spyOn(fileWritterStub, "writeInFile");
    await sut.execute(error);

    expect(fileWritterSpy).toHaveBeenCalledTimes(1);
    expect(fileWritterSpy).toHaveBeenCalledWith(errorFilePath, errorText);
  });

  it("Should throw if FileWritter throws", async () => {
    const { sut, fileWritterStub } = makeSut();
    jest
      .spyOn(fileWritterStub, "writeInFile")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute(error)).rejects.toThrow();
  });
});
