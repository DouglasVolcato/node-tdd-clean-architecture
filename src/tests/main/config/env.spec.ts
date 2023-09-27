import { config } from "dotenv";
import { Env } from "../../../main/config";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Environment Variables", () => {
  it("should return default values if environment variables are not defined", () => {
    (config as jest.Mock).mockReturnValueOnce({ parsed: {} });

    expect(config).toHaveBeenCalledTimes(1);
    expect(Env.MONGO_TEST_URL).toBe("");
    expect(Env.MONGO_URL).toBe("");
  });
});
