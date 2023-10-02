import {
  TokenGeneratorInterface,
  TokenValidatorInterface,
} from "../../domain/abstract";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export class TokenHandlerAdapter
  implements TokenGeneratorInterface, TokenValidatorInterface
{
  public generateToken(content: any, secret: string): string {
    return sign(content, secret, {
      expiresIn: 86400,
    });
  }
  public validateToken(token: string, secret: string): string | Error {
    const payload = verify(token, secret) as JwtPayload;
    return payload.id;
  }
}
