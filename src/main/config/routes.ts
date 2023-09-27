import { RouteDtoType, RouteEnumType } from "../abstract";
import { makeCreateUserControllerFactory } from "../factories";

export const routes: RouteDtoType[] = [
  {
    type: RouteEnumType.POST,
    url: "/user/create",
    controller: makeCreateUserControllerFactory(),
  },
];
