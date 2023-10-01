import { TokenGeneratorInterface } from "../../domain/abstract/helpers/token-generator-interface";
import { sign } from "jsonwebtoken";

export class TokenHandlerAdapter implements TokenGeneratorInterface {
  public generateToken(content: any, secret: string): string {
    return sign(content, secret, {
      expiresIn: 86400,
    });
  }
}
