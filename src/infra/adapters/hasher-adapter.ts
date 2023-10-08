import { HashValidatorInterface, HasherInterface } from "../../data/protocols";
import { hashSync, compareSync } from "bcrypt";

export class HasherAdapter implements HasherInterface, HashValidatorInterface {
  private readonly hashSalt: number;

  public constructor(hashSalt: number) {
    this.hashSalt = hashSalt;
  }

  public hash(value: string): string {
    return hashSync(value, this.hashSalt);
  }

  public validate(value: string, hashedValue: string): boolean {
    return compareSync(value, hashedValue);
  }
}
