import { FileWritterInterface } from "../../../../src/domain/abstract";

export class FileWritterStub implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    return;
  }
}
