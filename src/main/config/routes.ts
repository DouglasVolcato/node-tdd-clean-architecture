import { RouteDtoType } from "../abstract";
import { makeCreateUserControllerFactory } from "../factories";

export const routes: RouteDtoType[] = [
  {
    url: "/user/create",
    controller: makeCreateUserControllerFactory(),
  },
];
