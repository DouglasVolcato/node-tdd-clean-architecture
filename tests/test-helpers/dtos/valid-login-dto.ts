import { LoginDtoType } from "../../../src/domain/abstract";

export const makeValidLoginDto = (): LoginDtoType => ({
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});
