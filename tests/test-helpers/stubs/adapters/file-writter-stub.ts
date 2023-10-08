import { FileWritterInterface } from "../../../../src/data/protocols";

export class FileWritterStub implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    return;
  }
}
