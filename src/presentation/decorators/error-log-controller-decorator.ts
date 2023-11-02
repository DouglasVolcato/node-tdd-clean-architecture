import { ErrorLogUseCaseInterface } from "../../domain/protocols";
import {
  ControllerInterface,
  ControllerOutputType,
} from "../../presentation/protocols";

export class ErrorLogControllerDecorator implements ControllerInterface {
  private readonly controller: ControllerInterface;
  private readonly errorLogService: ErrorLogUseCaseInterface.Service;

  public constructor(
    controller: ControllerInterface,
    errorLogService: ErrorLogUseCaseInterface.Service
  ) {
    this.controller = controller;
    this.errorLogService = errorLogService;
  }

  public async execute(request: any): Promise<ControllerOutputType<any>> {
    const response = await this.controller.execute(request);
    if (response.statusCode === 500 && response.data instanceof Error) {
      this.errorLogService.execute({
        error: response.data,
        content: JSON.stringify(request),
      });
    }
    return response;
  }
}
