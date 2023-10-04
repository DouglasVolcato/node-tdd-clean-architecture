import { FrameWorkAdapter } from "../../../src/main/adapters";
import { Env } from "../../../src/main/config";
import { UserEntityType } from "../../../src/domain/abstract";
import { DatabaseConnector, UserModel } from "../../../src/infra/database";
import { Express } from "express";
import request from "supertest";
import { userRoutes } from "../../../src/main/routes";
import { HasherAdapter } from "../../../src/infra/adapters";
import { sign } from "jsonwebtoken";

const vars = new Env().getVariables();
const route = `/user/delete/`;
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

const makeValidUserEntity = (): UserEntityType => ({
  id: "23h9f82hf892h8",
  name: "Douglas",
  password: new HasherAdapter(10).hash("Test123"),
  email: "douglasvolcato@gmail.com",
});

const makeValidToken = () =>
  sign({ id: makeValidUserEntity().id }, new Env().getVariables().SECRET, {
    expiresIn: 86400,
  });

describe("Create user routes", () => {
  beforeAll(async () => {
    frameworkAdapter = new FrameWorkAdapter(userRoutes, vars.PORT);
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(process.env.MONGO_URL);
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await frameworkAdapter.stop();
    await databaseConnector.disconnect();
    jest.setTimeout(30000);
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe(`DELETE ${route}`, () => {
    test("Should return 401 if authorization was not given", async () => {
      const response = await request(app)
        .delete(route + makeValidUserEntity().id)
        .send();

      expect(response.statusCode).toBe(401);
    });

    test("Should return 401 if authorization is in invalid format", async () => {
      const response = await request(app)
        .delete(route + makeValidUserEntity().id)
        .set("Authorization", "any_authorization")
        .send();

      expect(response.statusCode).toBe(401);
    });

    test("Should return 401 if authorization is invalid", async () => {
      const response = await request(app)
        .delete(route + makeValidUserEntity().id)
        .set("Authorization", "Bearer invalid_authorization")
        .send();

      expect(response.statusCode).toBe(401);
    });

    test("Should return 401 if token is valid but it is not related to a user", async () => {
      const response = await request(app)
        .delete(route + makeValidUserEntity().id)
        .set("Authorization", `Bearer ${makeValidToken()}`)
        .send();

      expect(response.statusCode).toBe(401);
    });

    test("Should return 401 if id from token is different from the requested id", async () => {
      await new UserModel(makeValidUserEntity()).save();
      const response = await request(app)
        .delete(route + "invalid_id")
        .set("Authorization", `Bearer ${makeValidToken()}`)
        .send();
      const foundUser = await UserModel.findOne({
        id: makeValidUserEntity().id,
      }).exec();

      expect(response.statusCode).toBe(401);
      expect(foundUser).toBeDefined();
    });

    test("Should return 200 on deleted user", async () => {
      await new UserModel(makeValidUserEntity()).save();
      const response = await request(app)
        .delete(route + makeValidUserEntity().id)
        .set("Authorization", `Bearer ${makeValidToken()}`)
        .send();
      const foundUser = await UserModel.findOne({
        id: makeValidUserEntity().id,
      }).exec();

      expect(response.statusCode).toBe(200);
      expect(foundUser).toBeNull();
    });
  });
});
