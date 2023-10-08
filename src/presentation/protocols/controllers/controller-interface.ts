import { ControllerInputType } from "./input-type";
import { ControllerOutputType } from "./output-type";

export interface ControllerInterface {
  execute(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;
}
