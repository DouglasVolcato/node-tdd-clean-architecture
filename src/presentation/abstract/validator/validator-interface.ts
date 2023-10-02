import { ControllerInputType } from "../controllers/input-type";

export interface ValidatorInterface {
  validate(request: ControllerInputType<any>): Error | undefined;
}
