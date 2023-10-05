import { ErrorLogServiceInterface } from "../../domain/abstract";
import {
  ControllerInterface,
  ControllerOutputType,
} from "../../presentation/abstract";

export class ErrorLogControllerDecorator implements ControllerInterface {
  private readonly controller: ControllerInterface;
  private readonly errorLogService: ErrorLogServiceInterface;

  public constructor(
    controller: ControllerInterface,
    errorLogService: ErrorLogServiceInterface
  ) {
    this.controller = controller;
    this.errorLogService = errorLogService;
  }

  public async execute(request: any): Promise<ControllerOutputType<any>> {
    const response = await this.controller.execute(request);
    if (response.statusCode === 500 && response.data instanceof Error) {
      this.errorLogService.execute(response.data);
    }
    return response;
  }
}
