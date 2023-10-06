import {
  TokenGeneratorInterface,
  TokenDecrypterInterface,
} from "../../domain/abstract";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export class TokenHandlerAdapter
  implements TokenGeneratorInterface, TokenDecrypterInterface
{
  public generateToken(content: any, secret: string): string {
    return sign(content, secret, {
      expiresIn: 86400,
    });
  }

  public decryptToken(token: string, secret: string): string | undefined {
    try {
      const payload = verify(token, secret) as JwtPayload;
      return payload.id;
    } catch (error) {
      return undefined;
    }
  }
}
