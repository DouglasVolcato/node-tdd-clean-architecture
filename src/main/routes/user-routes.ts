import { makeDeleteUserControllerFactory } from "../../main/factories/controllers/delete-user-controller-factory";
import { RouteDtoType, RouteEnumType } from "../protocols";
import { makeCreateUserControllerFactory } from "../factories";
import { makeUserAuthMiddlewareFactory } from "../../main/factories/middlewares/user-auth-middleware-factory";

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
];
