import { UserDtoType } from "../../../src/data/protocols";

export const makeValidUserDto = (): UserDtoType => ({
  name: "Douglas",
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});
