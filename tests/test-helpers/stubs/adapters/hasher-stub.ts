import { HasherInterface } from "../../../../src/data/protocols";

export class HasherStub implements HasherInterface {
  public hash(value: string): string {
    return "hashed_value";
  }
}
