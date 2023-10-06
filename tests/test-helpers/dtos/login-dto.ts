import { LoginDtoType } from "../../../src/domain/abstract";

export const makeLoginDto = (): LoginDtoType => {
  return {
    email: "login_email@email.com",
    password: "login_password",
  };
};
