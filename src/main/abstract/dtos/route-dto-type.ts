import { Controller } from "../../../presentation/controllers";

export enum RouteEnumType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export type RouteDtoType = {
  type: RouteEnumType;
  url: string;
  controller: Controller;
};
