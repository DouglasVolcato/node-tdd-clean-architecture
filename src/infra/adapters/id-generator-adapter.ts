import { IdGeneratorInterface } from "../../domain/abstract";
import { v4 } from "uuid";

export class IdGeneratorAdapter implements IdGeneratorInterface {
  public generateId(): string {
    return v4();
  }
}
