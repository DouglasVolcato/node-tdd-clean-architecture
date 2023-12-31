import { DeleteUserUseCaseInterface } from "../../../src/domain/protocols";
import { DeleteUserController } from "../../../src/presentation/controllers";
import { InvalidFieldError } from "../../../src/presentation/errors";
import {
  badRequest,
  ok,
  unauthorized,
} from "../../../src/presentation/helpers";
import {
  DeleteUserServiceStub,
  makeUserEntity,
  throwError,
} from "../../test-helpers";

const makeDeleteUserRequest = () => ({
  user: makeUserEntity(),
  id: makeUserEntity().id,
});

type SutTypes = {
  sut: DeleteUserController;
  deleteUserServiceStub: DeleteUserUseCaseInterface.Service;
};

const makeSut = (): SutTypes => {
  const deleteUserServiceStub = new DeleteUserServiceStub();
  const sut = new DeleteUserController(deleteUserServiceStub);
  return { sut, deleteUserServiceStub };
};

describe("DeleteUserController", () => {
  it("Should call DeleteUserService with correct id", async () => {
    const { sut, deleteUserServiceStub } = makeSut();
    const deleteRequest = makeDeleteUserRequest();
    const serviceSpy = jest.spyOn(deleteUserServiceStub, "execute");
    await sut.execute(deleteRequest);

    expect(serviceSpy).toHaveBeenCalledTimes(1);
    expect(serviceSpy).toHaveBeenCalledWith({ id: deleteRequest.id });
  });

  it("Should return the deleted user", async () => {
    const { sut, deleteUserServiceStub } = makeSut();
    const deleteRequest = makeDeleteUserRequest();
    const userEntity = makeUserEntity();
    jest
      .spyOn(deleteUserServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(userEntity));
    const response = await sut.execute(deleteRequest);

    expect(response).toEqual(ok(userEntity));
  });

  it("Should return a error if DeleteUserService returns an error", async () => {
    const { sut, deleteUserServiceStub } = makeSut();
    const deleteRequest = makeDeleteUserRequest();
    jest
      .spyOn(deleteUserServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(new InvalidFieldError("id")));
    const error = await sut.execute(deleteRequest);

    expect(error).toEqual(badRequest(new InvalidFieldError("id")));
  });

  it("Should return a error if userId is different from the user being deleted", async () => {
    const { sut } = makeSut();
    const deleteRequest = { ...makeDeleteUserRequest(), id: "invalid_id" };
    const error = await sut.execute(deleteRequest);

    expect(error).toEqual(unauthorized());
  });

  it("Should return a server error if DeleteUserService throws", async () => {
    const { sut, deleteUserServiceStub } = makeSut();
    const deleteRequest = makeDeleteUserRequest();
    jest
      .spyOn(deleteUserServiceStub, "execute")
      .mockImplementationOnce(() => throwError());

    const response = await sut.execute(deleteRequest);

    expect(response.statusCode).toBe(500);
    expect(response.data).toBeInstanceOf(Error);
  });
});
