import { FrameWorkAdapter } from "../../../src/main/adapters";
import { Env } from "../../../src/main/config";
import { LoginDtoType, UserEntityType } from "../../../src/domain/abstract";
import { DatabaseConnector, UserModel } from "../../../src/infra/database";
import { Express } from "express";
import request from "supertest";
import { loginRoutes } from "../../../src/main/routes";
import { HasherAdapter } from "../../../src/infra/adapters";

const route = "/login";
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

const makeValidLoginDto = (): LoginDtoType => ({
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});

const makeValidUserDto = (): UserEntityType => ({
  id: "23h9f82hf892h8",
  name: "Douglas",
  password: new HasherAdapter(10).hash("Test123"),
  email: "douglasvolcato@gmail.com",
});

describe("Login routes", () => {
  beforeAll(async () => {
    const vars = new Env().getVariables();
    frameworkAdapter = new FrameWorkAdapter(loginRoutes, vars.PORT);
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

  describe(`POST ${route}`, () => {
    test("Should return 400 if user does not exist", async () => {
      const response = await request(app).post(route).send(makeValidLoginDto());

      expect(response.statusCode).toBe(400);
    });

    test("Should return 200 with the generated token", async () => {
      const newUser = new UserModel(makeValidUserDto());
      await newUser.save();
      const response = await request(app).post(route).send(makeValidLoginDto());

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test("Should return 400 if password is invalid", async () => {
      const newUser = new UserModel(makeValidUserDto());
      await newUser.save();
      const response = await request(app)
        .post(route)
        .send({ ...makeValidLoginDto(), password: "invalid_password" });

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if does not receive password", async () => {
      const requestBody = makeValidLoginDto();
      delete requestBody.password;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if does not receive email", async () => {
      const requestBody = makeValidLoginDto();
      delete requestBody.email;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });

    test("Should return 400 if email is not valid", async () => {
      const requestBody = makeValidLoginDto();
      requestBody.email = "invalid_email";
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
    });
  });
});
