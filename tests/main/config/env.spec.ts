import { config } from "dotenv";
import { Env } from "../../../src/main/config";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Environment Variables", () => {
  it("should return default values if environment variables are not defined", () => {
    (config as jest.Mock).mockReturnValueOnce({ parsed: {} });

    expect(config).toHaveBeenCalledTimes(1);
    expect(Env.DB_URL).toBe("");
    expect(Env.PORT).toBe(7777);
  });
});
