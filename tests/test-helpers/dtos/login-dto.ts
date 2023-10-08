import { LoginDtoType } from "../../../src/data/protocols";

export const makeLoginDto = (): LoginDtoType => {
  return {
    email: "login_email@email.com",
    password: "login_password",
  };
};
