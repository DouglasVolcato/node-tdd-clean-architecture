import { FrameWorkAdapter } from "../../../src/main/adapters";
import { Env } from "../../../src/main/config";
import { LoginDtoType } from "../../../src/domain/abstract";
import { DatabaseConnector } from "../../../src/infra/database";
import { Express } from "express";
import request from "supertest";
import { loginRoutes } from "../../../src/main/routes";

const route = "/login";
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

const makeValidLoginDto = (): LoginDtoType => ({
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});

describe("Login routes", () => {
  beforeAll(async () => {
    const vars = new Env().getVariables();
    frameworkAdapter = new FrameWorkAdapter(loginRoutes, 1);
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(process.env.MONGO_URL);
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await databaseConnector.disconnect();
  });

  describe(`POST ${route}`, () => {
    test("Should return 200 with the generated token", async () => {
      const requestBody = makeValidLoginDto();

      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(200);
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
