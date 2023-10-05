import { writeFile } from "fs/promises";
import { throwError } from "../../test-helpers";
import { FileHandlerAdapter } from "../../../src/infra/adapters";

jest.mock("fs/promises", () => ({
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
  it("WriteFile should be called with correct values", async () => {
    const { sut } = makeSut();
    await sut.writeInFile("any_path", "any_content");

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith("any_path", "any_content");
  });

  it("Should throw if writeFile throws", async () => {
    const { sut } = makeSut();
    (writeFile as jest.Mock).mockImplementationOnce(() => throwError());

    expect(
      async () => await sut.writeInFile("any_path", "any_content")
    ).rejects.toThrow();
  });
});
