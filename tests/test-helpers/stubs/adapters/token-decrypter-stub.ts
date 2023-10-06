import { TokenDecrypterInterface } from "../../../../src/domain/abstract";

export class TokenDecrypterStub implements TokenDecrypterInterface {
  public decryptToken(token: string, secret: string): string {
    return "any_key";
  }
}
