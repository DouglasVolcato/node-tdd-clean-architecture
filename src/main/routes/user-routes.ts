import {
  makeDeleteUserControllerFactory,
  makeUserAuthMiddlewareFactory,
  makeGetUserByTokenFactory,
} from "../../main/factories";
import { RouteDtoType, RouteEnumType } from "../protocols";
import { makeCreateUserControllerFactory } from "../factories";

export const userRoutes: RouteDtoType[] = [
  {
    type: RouteEnumType.POST,
    url: "/user/create",
    controller: makeCreateUserControllerFactory(),
  },
  {
    type: RouteEnumType.DELETE,
    url: "/user/delete/:id",
    controller: makeDeleteUserControllerFactory(),
    middleware: makeUserAuthMiddlewareFactory(),
  },
  {
    type: RouteEnumType.GET,
    url: "/user/get/token",
    controller: makeGetUserByTokenFactory(),
  },
];
