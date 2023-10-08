import { UserEntityType } from "../../../src/domain/protocols";

export const makeUserEntity = (): UserEntityType => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});
