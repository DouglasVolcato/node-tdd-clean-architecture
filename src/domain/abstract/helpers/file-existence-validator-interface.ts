export interface FileExistenceValidatorInterface {
  validateFile(filePath: string): Promise<boolean>;
}
