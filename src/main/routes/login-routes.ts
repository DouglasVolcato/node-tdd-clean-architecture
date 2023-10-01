import { RouteDtoType, RouteEnumType } from "../abstract";
import { makeLoginControllerFactory } from "../factories";

export const loginRoutes: RouteDtoType[] = [
  {
    type: RouteEnumType.POST,
    url: "/login",
    controller: makeLoginControllerFactory(),
  },
];
