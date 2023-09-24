import { UserDtoType } from "@/domain/abstract";

export const makeUserDto = (): UserDtoType => ({
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
