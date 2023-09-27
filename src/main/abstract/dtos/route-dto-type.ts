import { Controller } from "../../../presentation/controllers";

export enum RouteEnumType {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

export type RouteDtoType = {
  type: RouteEnumType;
  url: string;
  controller: Controller;
};
