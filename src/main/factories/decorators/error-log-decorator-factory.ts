import { ErrorLogService } from "../../../data/services";
import { FileHandlerAdapter } from "../../../infra/adapters";
import { ControllerInterface } from "../../../presentation/protocols";
import { ErrorLogControllerDecorator } from "../../../presentation/decorators";

export function makeErrorLogControllerDecoratorFactory(
  controller: ControllerInterface
): ControllerInterface {
  const fileWritter = new FileHandlerAdapter();
  const errorLogService = new ErrorLogService(fileWritter);
  return new ErrorLogControllerDecorator(controller, errorLogService);
}
