import { UserDtoType } from "../../../src/data/protocols";

export const makeUserDto = (): UserDtoType => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});
