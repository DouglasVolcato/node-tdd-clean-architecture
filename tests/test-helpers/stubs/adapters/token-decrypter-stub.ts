import { TokenDecrypterInterface } from "../../../../src/data/protocols";

export class TokenDecrypterStub implements TokenDecrypterInterface {
  public decryptToken(token: string, secret: string): string {
    return "any_key";
  }
}
