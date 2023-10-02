import mongoose from "mongoose";
import { makeUserEntity, throwError } from "../../../tests/test-helpers";
import {
  DatabaseConnector,
  UserModel,
  UserRepository,
} from "../../../src/infra/database";

mongoose.Promise = global.Promise;
const databaseConnector = new DatabaseConnector();

beforeAll(async () => {
  await databaseConnector.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await databaseConnector.disconnect();
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

  describe("Create", () => {
    it("Should create a new user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      const createdUser = await sut.create(userEntity);

      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe(userEntity.name);
      expect(createdUser.email).toBe(userEntity.email);
      expect(createdUser.password).toBe(userEntity.password);
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(UserModel.prototype, "save")
        .mockImplementationOnce(() => throwError());

      await expect(() => sut.create(makeUserEntity())).rejects.toThrow();
    });
  });

  describe("GetByEmail", () => {
    it("Should return a user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      await sut.create(userEntity);
      const foundUser = await sut.getByEmail(userEntity.email);

      expect(foundUser.id).toBeDefined();
      expect(foundUser.name).toBe(userEntity.name);
      expect(foundUser.email).toBe(userEntity.email);
      expect(foundUser.password).toBe(userEntity.password);
    });

    it("Should return undefined if user was not found", async () => {
      const { sut } = makeSut();
      const foundUser = await sut.getByEmail(makeUserEntity().email);

      expect(foundUser).toBeUndefined();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(UserModel, "findOne")
        .mockImplementationOnce(() => throwError());

      await expect(
        async () => await sut.getByEmail(makeUserEntity().email)
      ).rejects.toThrow();
    });
  });

  describe("GetById", () => {
    it("Should return a user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      await sut.create(userEntity);
      const foundUser = await sut.getById(userEntity.id);

      expect(foundUser.id).toBeDefined();
      expect(foundUser.name).toBe(userEntity.name);
      expect(foundUser.email).toBe(userEntity.email);
      expect(foundUser.password).toBe(userEntity.password);
    });

    it("Should return undefined if user was not found", async () => {
      const { sut } = makeSut();
      const foundUser = await sut.getById(makeUserEntity().id);

      expect(foundUser).toBeUndefined();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(UserModel, "findOne")
        .mockImplementationOnce(() => throwError());

      await expect(
        async () => await sut.getById(makeUserEntity().id)
      ).rejects.toThrow();
    });
  });
});
