import { FileWritterInterface } from "../../../src/data/protocols";
import { appendFile } from "fs/promises";

export class FileHandlerAdapter implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    return await appendFile(filePath, content);
  }
}
