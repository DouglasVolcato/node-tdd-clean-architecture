import { ControllerInputType } from "../controllers/input-type";

export interface MiddlewareInterface {
  execute(request: ControllerInputType<any>): any | Error;
}
