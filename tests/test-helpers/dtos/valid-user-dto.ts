import { UserDtoType } from "../../../src/domain/abstract";

export const makeValidUserDto = (): UserDtoType => ({
  name: "Douglas",
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});
