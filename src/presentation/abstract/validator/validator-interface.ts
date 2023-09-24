import { ControllerInputType } from "../controller/input-type";

export interface ValidatorInterface {
  validate(request: ControllerInputType<any>): Error | undefined;
}
