import { UserDtoType, UserEntityType } from "@/domain/abstract";
import { ControllerInputType } from "./input-type";
import { ControllerOutputType } from "./output-type";

export interface ControllerInterface {
  execute(
    request: ControllerInputType<UserDtoType>
  ): Promise<ControllerOutputType<UserEntityType | Error>>;
}
