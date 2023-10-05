import { appendFile } from "fs/promises";
import { throwError } from "../../test-helpers";
import { FileHandlerAdapter } from "../../../src/infra/adapters";

jest.mock("fs/promises", () => ({
  appendFile: jest.fn(),
}));

type SutTypes = {
  sut: FileHandlerAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new FileHandlerAdapter();
  return { sut };
};

describe("FileHandlerAdapter", () => {
  it("AppendFile should be called with correct values", async () => {
    const { sut } = makeSut();
    await sut.writeInFile("any_path", "any_content");

    expect(appendFile).toHaveBeenCalledTimes(1);
    expect(appendFile).toHaveBeenCalledWith("any_path", "any_content");
  });

  it("Should throw if appendFile throws", async () => {
    const { sut } = makeSut();
    (appendFile as jest.Mock).mockImplementationOnce(() => throwError());

    expect(
      async () => await sut.writeInFile("any_path", "any_content")
    ).rejects.toThrow();
  });
});
