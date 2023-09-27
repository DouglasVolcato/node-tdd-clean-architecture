import { HasherInterface } from "../../domain/abstract";
import { hashSync } from "bcrypt";

export class HasherAdapter implements HasherInterface {
  private readonly hashSalt: number;

  public constructor(hashSalt: number) {
    this.hashSalt = hashSalt;
  }

  public hash(value: string): string {
    return hashSync(value, this.hashSalt);
  }
}
