export interface FileWritterInterface {
  writeInFile(filePath: string, content: string): Promise<void>;
}
