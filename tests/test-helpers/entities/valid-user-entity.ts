import { HasherAdapter } from "../../../src/infra/adapters";
import { UserEntityType } from "../../../src/domain/abstract";

export const makeValidUserEntity = (): UserEntityType => ({
  id: "23h9f82hf892h8",
  name: "Douglas",
  password: new HasherAdapter(10).hash("Test123"),
  email: "douglasvolcato@gmail.com",
});
