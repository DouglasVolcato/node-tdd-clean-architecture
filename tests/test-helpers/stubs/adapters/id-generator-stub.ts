import { IdGeneratorInterface } from "../../../../src/data/protocols";

export class IdGeneratorStub implements IdGeneratorInterface {
  public generateId(): string {
    return "any_id";
  }
}
