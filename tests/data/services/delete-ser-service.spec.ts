import {
  DeleteUserRepositoryStub,
  makeUserEntity,
  throwError,
} from "../../test-helpers";
import { DeleteUserRepositoryInterface } from "../../../src/data/protocols";
import { InvalidFieldError } from "../../../src/presentation/errors";
import { DeleteUserService } from "../../../src/data/services";

type SutTypes = {
  sut: DeleteUserService;
  deleteUserRepositoryStub: DeleteUserRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const deleteUserRepositoryStub = new DeleteUserRepositoryStub();
  const sut = new DeleteUserService(deleteUserRepositoryStub);
  return { sut, deleteUserRepositoryStub };
};

describe("DeleteUserService", () => {
  it("Should call DeleteUserRepository with correct values", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const userEntity = makeUserEntity();
    const repostiorySpy = jest.spyOn(deleteUserRepositoryStub, "delete");
    await sut.execute(userEntity.id);

    expect(repostiorySpy).toHaveBeenCalledTimes(1);
    expect(repostiorySpy).toHaveBeenCalledWith(userEntity.id);
  });

  it("Should return the deleted user", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const userEntity = makeUserEntity();
    jest
      .spyOn(deleteUserRepositoryStub, "delete")
      .mockReturnValueOnce(Promise.resolve(userEntity));
    const user = await sut.execute(userEntity.id);

    expect(user).toEqual(userEntity);
  });

  it("Should return an error if DeleteUserRepository returns undefined", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const userEntity = makeUserEntity();
    jest
      .spyOn(deleteUserRepositoryStub, "delete")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute(userEntity.id);

    expect(error).toEqual(new InvalidFieldError("id"));
  });

  it("Should throw if DeleteUserRepository throws", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const userEntity = makeUserEntity();
    jest
      .spyOn(deleteUserRepositoryStub, "delete")
      .mockImplementationOnce(() => throwError());

    expect(async () => await sut.execute(userEntity.id)).rejects.toThrow();
  });
});
