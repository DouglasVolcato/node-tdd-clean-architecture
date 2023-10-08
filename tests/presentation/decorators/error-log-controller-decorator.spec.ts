import { ErrorLogControllerDecorator } from "../../../src/presentation/decorators";
import { ControllerInterface } from "../../../src/presentation/protocols";
import { ControllerStub, ErrorLogServiceStub } from "../../test-helpers";
import { ErrorLogServiceInterface } from "../../../src/domain/protocols";

const makeRequest = (): any => ({
  property1: "any_value",
  property2: "any_value",
});

type SutTypes = {
  sut: ErrorLogControllerDecorator;
  controllerStub: ControllerInterface;
  errorLogServiceStub: ErrorLogServiceInterface;
};

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub();
  const errorLogServiceStub = new ErrorLogServiceStub();
  const sut = new ErrorLogControllerDecorator(
    controllerStub,
    errorLogServiceStub
  );
  return { sut, controllerStub, errorLogServiceStub };
};

describe("ErrorLogControllerDecorator", () => {
  it("Should call controller with correct values", async () => {
    const { sut, controllerStub } = makeSut();
    const controllerSpy = jest.spyOn(controllerStub, "execute");
    await sut.execute(makeRequest());

    expect(controllerSpy).toHaveBeenCalledTimes(1);
    expect(controllerSpy).toHaveBeenCalledWith(makeRequest());
  });

  it("Should return what the controller returns", async () => {
    const { sut, controllerStub } = makeSut();
    const controllerResponse = {
      statusCode: 200,
      data: {
        value: "any_value",
      },
    };
    jest
      .spyOn(controllerStub, "execute")
      .mockReturnValueOnce(Promise.resolve(controllerResponse));
    const response = await sut.execute(makeRequest());

    expect(response).toEqual(controllerResponse);
  });

  it("Should call ErrorLogService with correct values if status code is 500 and data is an error", async () => {
    const { sut, controllerStub, errorLogServiceStub } = makeSut();
    const controllerResponse = {
      statusCode: 500,
      data: new Error("any_error"),
    };
    jest
      .spyOn(controllerStub, "execute")
      .mockReturnValueOnce(Promise.resolve(controllerResponse));
    const errorLogServiceSpy = jest.spyOn(errorLogServiceStub, "execute");
    await sut.execute(makeRequest());

    expect(errorLogServiceSpy).toHaveBeenCalledTimes(1);
    expect(errorLogServiceSpy).toHaveBeenCalledWith(
      controllerResponse.data,
      JSON.stringify(makeRequest())
    );
  });

  it("Should not call ErrorLogService if status code is not 500 and data is an error", async () => {
    const { sut, controllerStub, errorLogServiceStub } = makeSut();
    const controllerResponse = {
      statusCode: 200,
      data: new Error("any_error"),
    };
    jest
      .spyOn(controllerStub, "execute")
      .mockReturnValueOnce(Promise.resolve(controllerResponse));
    const errorLogServiceSpy = jest.spyOn(errorLogServiceStub, "execute");
    await sut.execute(makeRequest());

    expect(errorLogServiceSpy).not.toHaveBeenCalledTimes(1);
    expect(errorLogServiceSpy).not.toHaveBeenCalledWith(
      controllerResponse.data
    );
  });

  it("Should not call ErrorLogService if status code is 500 but data is not an error", async () => {
    const { sut, controllerStub, errorLogServiceStub } = makeSut();
    const controllerResponse = {
      statusCode: 200,
      data: {
        value: "any_value",
      },
    };
    jest
      .spyOn(controllerStub, "execute")
      .mockReturnValueOnce(Promise.resolve(controllerResponse));
    const errorLogServiceSpy = jest.spyOn(errorLogServiceStub, "execute");
    await sut.execute(makeRequest());

    expect(errorLogServiceSpy).not.toHaveBeenCalledTimes(1);
    expect(errorLogServiceSpy).not.toHaveBeenCalledWith(
      controllerResponse.data
    );
  });
});
