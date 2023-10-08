import { UserEntityType } from "../../../src/domain/protocols";
import { HasherAdapter } from "../../../src/infra/adapters";

export const makeValidUserEntity = (): UserEntityType => ({
  id: "23h9f82hf892h8",
  name: "Douglas",
  password: new HasherAdapter(10).hash("Test123"),
  email: "douglasvolcato@gmail.com",
});
