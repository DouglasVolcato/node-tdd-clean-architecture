import { ErrorLogService } from "../../../src/domain/services";
import { FileWritterStub, throwError } from "../../test-helpers";
import {
  ErrorLogServiceInterface,
  FileWritterInterface,
} from "../../../src/domain/abstract";

Date.prototype.toLocaleString = jest
  .fn()
  .mockReturnValue("06/10/2023 23:00:00");

const error = new Error("any_error");
const errorFilePath = "src/main/logs/error.log";
const errorText = `\n${new Date().toLocaleString()} - ${error.message} - ${
  error.stack
}`;

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
