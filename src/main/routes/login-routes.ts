import { RouteDtoType, RouteEnumType } from "../protocols";
import { makeLoginControllerFactory } from "../factories";

export const loginRoutes: RouteDtoType[] = [
  {
    type: RouteEnumType.POST,
    url: "/login",
    controller: makeLoginControllerFactory(),
  },
];
