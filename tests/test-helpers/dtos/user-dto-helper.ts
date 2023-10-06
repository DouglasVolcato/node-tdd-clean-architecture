import { UserDtoType } from "../../../src/domain/abstract";

export const makeUserDto = (): UserDtoType => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});
