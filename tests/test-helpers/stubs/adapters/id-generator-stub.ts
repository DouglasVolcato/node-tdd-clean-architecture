import { IdGeneratorInterface } from "../../../../src/domain/abstract";

export class IdGeneratorStub implements IdGeneratorInterface {
  public generateId(): string {
    return "any_id";
  }
}
