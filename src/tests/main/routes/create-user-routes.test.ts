import { FrameWorkAdapter } from "../../../main/adapters";
import { Env, userRoutes } from "../../../main/config";
import { UserDtoType } from "../../../domain/abstract";
import { DatabaseConnector } from "../../../infra/database";
import { Express } from "express";
import request from "supertest";

const route = "/user/create";
const databaseConnector = new DatabaseConnector();
let frameworkAdapter: FrameWorkAdapter;
let app: Express;

const makeValidUserDto = (): UserDtoType => ({
  name: "Douglas",
  password: "Test123",
  email: "douglasvolcato@gmail.com",
});

describe("Create user routes", () => {
  beforeAll(async () => {
    frameworkAdapter = new FrameWorkAdapter(userRoutes, Env.PORT);
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(Env.MONGO_TEST_URL);
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await databaseConnector.disconnect();
  });

  describe(`POST ${route}`, () => {
    test("Should return 200 with the created user", async () => {
      const requestBody = makeValidUserDto();
    
       const response = await request(app).post(route).send(requestBody);

       expect(response.statusCode).toBe(200);
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
  });
});
