import { TokenGeneratorInterface } from "../../../../src/data/protocols";

export class TokenGeneratorStub implements TokenGeneratorInterface {
  public generateToken(content: any, secret: string): string {
    return "generated_token";
  }
}
