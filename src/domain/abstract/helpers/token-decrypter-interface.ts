export interface TokenDecrypterInterface {
  decryptToken(token: string, secret: string): string | undefined;
}
