import { DatabaseConnector, UserModel } from "../../../src/infra/database";
import { FrameWorkAdapter } from "../../../src/main/adapters";
import { makeValidUserEntity } from "../../test-helpers";
import { userRoutes } from "../../../src/main/routes";
import { Env } from "../../../src/main/config";
import { sign } from "jsonwebtoken";
import { Express } from "express";
import request from "supertest";

const vars = new Env().getVariables();
const route = `/user/get/token`;
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

const makeValidToken = () =>
  sign({ id: makeValidUserEntity().id }, new Env().getVariables().SECRET, {
    expiresIn: 86400,
  });

describe("GetUserByToken user routes", () => {
  beforeAll(async () => {
    frameworkAdapter = new FrameWorkAdapter(userRoutes, vars.PORT);
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(process.env.MONGO_URL);
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await frameworkAdapter.stop();
    await databaseConnector.disconnect();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe(`GET ${route}`, () => {
    test("Should return 400 if authorization was not given", async () => {
      const response = await request(app).get(route).send();

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if authorization is in invalid format", async () => {
      const response = await request(app)
        .get(route)
        .set("Authorization", "any_authorization")
        .send();

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if authorization is invalid", async () => {
      const response = await request(app)
        .get(route)
        .set("Authorization", "Bearer invalid_authorization")
        .send();

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if token is valid but it is not related to a user", async () => {
      const response = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${makeValidToken()}`)
        .send();

      expect(response.statusCode).toBe(400);
    });

    test("Should return 200 on found user", async () => {
      await new UserModel(makeValidUserEntity()).save();
      const response = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${makeValidToken()}`)
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(makeValidUserEntity().id);
      expect(response.body.name).toBe(makeValidUserEntity().name);
      expect(response.body.email).toBe(makeValidUserEntity().email);
    });
  });
});
