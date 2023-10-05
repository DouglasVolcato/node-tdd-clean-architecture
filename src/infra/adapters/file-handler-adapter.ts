import { FileWritterInterface } from "../../../src/domain/abstract";
import { writeFile } from "fs/promises";

export class FileHandlerAdapter implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    return await writeFile(filePath, content);
  }
}
