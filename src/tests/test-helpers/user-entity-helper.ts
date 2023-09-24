import { UserEntityType } from "@/domain/abstract";

export const makeUserEntity = (): UserEntityType => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
