import { ErrorLogUseCaseInterface } from "../../../src/domain/protocols";
import { ErrorLogService } from "../../../src/data/services";
import { FileWritterStub, makeLoginDto, throwError } from "../../test-helpers";
import { FileWritterInterface } from "../../../src/data/protocols";

Date.prototype.toLocaleString = jest
  .fn()
  .mockReturnValue("06/10/2023 23:00:00");

const error = new Error("any_error");
const errorFilePath = "src/main/logs/error.log";
const requestContent = JSON.stringify(makeLoginDto());
const errorText = `\n${new Date().toLocaleString()} - ${error.message} - ${
  error.stack
}\n${requestContent}`;

type SutTypes = {
  sut: ErrorLogUseCaseInterface.Service;
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
    await sut.execute({ error: error, content: requestContent });

    expect(fileWritterSpy).toHaveBeenCalledTimes(1);
    expect(fileWritterSpy).toHaveBeenCalledWith(errorFilePath, errorText);
  });

  it("Should throw if FileWritter throws", async () => {
    const { sut, fileWritterStub } = makeSut();
    jest
      .spyOn(fileWritterStub, "writeInFile")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute({ error })).rejects.toThrow();
  });
});
