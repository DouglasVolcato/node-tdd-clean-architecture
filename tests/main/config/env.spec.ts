import { config } from "dotenv";
import { Env } from "../../../src/main/config";
import { ServerError } from "../../../src/presentation/errors";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

type SutTypes = {
  sut: Env;
};

const makeSut = (): SutTypes => {
  process.env.PORT = "8888";
  process.env.DB_URL = "mongodb://localhost:27017/mydb";
  const sut = new Env();
  return { sut };
};

describe("Environment Variables", () => {
  it("should correctly read environment variables when defined", () => {
    const { sut } = makeSut();
    const vars = sut.getVaiables();

    expect(config).toHaveBeenCalledTimes(1);
    expect(vars.PORT).toBe(8888);
    expect(vars.DB_URL).toBe("mongodb://localhost:27017/mydb");
  });

  it("should return default values if environment variables are not defined", () => {
    const { sut } = makeSut();
    process.env = {};
    (config as jest.Mock).mockReturnValueOnce({
      parsed: {},
    });
    const vars = sut.getVaiables();

    expect(vars.PORT).toBe(7777);
    expect(vars.DB_URL).toBe("");
  });

  it("should handle errors when .env file is missing or contains incorrect data", () => {
    const { sut } = makeSut();
    (config as jest.Mock).mockImplementationOnce(() => {
      throw new ServerError();
    });
    const vars = sut.getVaiables();

    expect(vars.PORT).toBe(7777);
    expect(vars.DB_URL).toBe("");
  });
});
