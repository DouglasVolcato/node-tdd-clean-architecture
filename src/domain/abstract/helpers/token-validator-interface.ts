export interface TokenValidatorInterface {
  validateToken(token: string, secret: string): string;
}
