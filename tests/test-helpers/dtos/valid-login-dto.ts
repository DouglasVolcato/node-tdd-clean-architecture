import { LoginDtoType } from "../../../src/data/protocols";

export const makeValidLoginDto = (): LoginDtoType => ({
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});
