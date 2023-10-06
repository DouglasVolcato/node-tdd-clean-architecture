import { TokenGeneratorInterface } from "../../../../src/domain/abstract";

export class TokenGeneratorStub implements TokenGeneratorInterface {
  public generateToken(content: any, secret: string): string {
    return "generated_token";
  }
}
