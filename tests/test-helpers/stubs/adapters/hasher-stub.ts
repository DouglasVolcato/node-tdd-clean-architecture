import { HasherInterface } from "../../../../src/domain/abstract";

export class HasherStub implements HasherInterface {
  public hash(value: string): string {
    return "hashed_value";
  }
}
