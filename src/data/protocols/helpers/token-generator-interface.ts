export interface TokenGeneratorInterface {
  generateToken(content: any, secret: string): string;
}
