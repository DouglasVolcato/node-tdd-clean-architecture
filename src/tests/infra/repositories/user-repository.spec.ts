import mongoose from "mongoose";
import { makeUserEntity, throwError } from "@/tests/test-helpers";
import { Env } from "@/main/config";
import { DatabaseConnector, UserModel, UserRepository } from "@/infra/database";

mongoose.Promise = global.Promise;

beforeAll(async () => {
  await DatabaseConnector.connect(Env.MONGO_TEST_URL)
});

afterAll(async () => {
  await DatabaseConnector.disconnect()
});

type SutTypes = {
  sut: UserRepository;
};

const makeSut = (): SutTypes => {
  const sut = new UserRepository();

  return { sut };
};

describe("UserRepository", () => {
  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("Should create a new user", async () => {
    const { sut } = makeSut();
    const userEntity = makeUserEntity();
    const createdUser = await sut.create(makeUserEntity());

    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).toBe(userEntity.name);
    expect(createdUser.email).toBe(userEntity.email);
    expect(createdUser.password).toBe(userEntity.password);
  });

  it("Should throw if mongoose throws", async () => {
    const { sut } = makeSut();
    UserModel.prototype.save = () => throwError();

    await expect(() => sut.create(makeUserEntity())).rejects.toThrow();
  });
});
