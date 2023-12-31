import { DatabaseConnector, UserModel } from "../../../src/infra/database";
import { makeValidUserDto, makeValidUserEntity } from "../../test-helpers";
import { FrameWorkAdapter } from "../../../src/main/adapters";
import { userRoutes } from "../../../src/main/routes";
import { Env } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";

const route = "/user/create";
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

describe("Create user routes", () => {
  beforeAll(async () => {
    const vars = new Env().getVariables();
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

  describe(`POST ${route}`, () => {
    test("Should return 200 with the created user", async () => {
      const requestBody = makeValidUserDto();
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.password).toBeDefined();
      expect(response.body.name).toBe(requestBody.name);
      expect(response.body.email).toBe(requestBody.email);
    });

    test("Should return 400 if does not receive name", async () => {
      const requestBody = makeValidUserDto();
      delete requestBody.name;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if does not receive password", async () => {
      const requestBody = makeValidUserDto();
      delete requestBody.password;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if does not receive email", async () => {
      const requestBody = makeValidUserDto();
      delete requestBody.email;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if email is not valid", async () => {
      const requestBody = makeValidUserDto();
      requestBody.email = "invalid_email";
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 email is already registered", async () => {
      const newUser = new UserModel(makeValidUserEntity());
      await newUser.save();
      const response = await request(app).post(route).send(makeValidUserDto());

      expect(response.statusCode).toBe(400);
    });
  });
});
