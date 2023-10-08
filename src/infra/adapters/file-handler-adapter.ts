import { FileWritterInterface } from "../../../src/data/protocols";
import { appendFile, access, constants, writeFile } from "fs/promises";

export class FileHandlerAdapter implements FileWritterInterface {
  public async writeInFile(filePath: string, content: string): Promise<void> {
    if (!(await this.checkIfFileExists(filePath))) {
      await this.createFile(filePath);
    }
    return await appendFile(filePath, content);
  }

  private async checkIfFileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, 0);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async createFile(filePath: string): Promise<void> {
    await writeFile(filePath, "");
  }
}
