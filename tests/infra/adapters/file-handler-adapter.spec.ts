import { appendFile, access, writeFile } from "fs/promises";
import { throwError } from "../../test-helpers";
import { FileHandlerAdapter } from "../../../src/infra/adapters";

jest.mock("fs/promises", () => ({
  appendFile: jest.fn(),
  access: jest.fn(),
  writeFile: jest.fn(),
}));

type SutTypes = {
  sut: FileHandlerAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new FileHandlerAdapter();
  return { sut };
};

describe("FileHandlerAdapter", () => {
  it("Access should be called with correct values", async () => {
    const { sut } = makeSut();
    (access as jest.Mock).mockReturnValueOnce(null);
    await sut.writeInFile("any_path", "any_content");

    expect(access).toHaveBeenCalledTimes(1);
    expect(access).toHaveBeenCalledWith("any_path", 0);
  });

  it("Should call writeFile if access throws", async () => {
    const { sut } = makeSut();
    (access as jest.Mock).mockImplementationOnce(() => throwError());
    await sut.writeInFile("any_path", "any_content");

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith("any_path", "");
  });

  it("Should throw if writeFile throws", async () => {
    const { sut } = makeSut();
    (access as jest.Mock).mockImplementationOnce(() => throwError());
    (writeFile as jest.Mock).mockImplementationOnce(() => throwError());

    expect(
      async () => await sut.writeInFile("any_path", "any_content")
    ).rejects.toThrow();
  });

  it("AppendFile should be called with correct values", async () => {
    const { sut } = makeSut();
    (access as jest.Mock).mockReturnValueOnce(null);
    await sut.writeInFile("any_path", "any_content");

    expect(appendFile).toHaveBeenCalledWith("any_path", "any_content");
  });

  it("Should throw if appendFile throws", async () => {
    const { sut } = makeSut();
    (access as jest.Mock).mockReturnValueOnce(null);
    (appendFile as jest.Mock).mockImplementationOnce(() => throwError());

    expect(
      async () => await sut.writeInFile("any_path", "any_content")
    ).rejects.toThrow();
  });
});
