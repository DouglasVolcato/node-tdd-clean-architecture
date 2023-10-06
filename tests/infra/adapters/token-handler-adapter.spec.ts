import { sign, verify } from "jsonwebtoken";
import { makeUserEntity, throwError } from "../../test-helpers";
import { TokenHandlerAdapter } from "../../../src/infra/adapters/token-handler-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

type SutTypes = {
  sut: TokenHandlerAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new TokenHandlerAdapter();
  return { sut };
};

describe("TokenHandlerAdapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GenerateToken", () => {
    it("Should call jwt library", () => {
      const { sut } = makeSut();
      sut.generateToken(makeUserEntity().id, "any_secret");

      expect(sign).toHaveBeenCalledTimes(1);
    });

    it("Should return generated token", () => {
      const { sut } = makeSut();
      (sign as jest.Mock).mockReturnValueOnce("generated_token");
      const generatedToken = sut.generateToken(
        makeUserEntity().id,
        "any_secret"
      );

      expect(generatedToken).toBe("generated_token");
    });

    it("Should throw if jwt throws", () => {
      const { sut } = makeSut();
      (sign as jest.Mock).mockImplementationOnce(() => throwError());

      expect(() =>
        sut.generateToken(makeUserEntity().id, "any_secret")
      ).toThrow();
    });
  });
  describe("ValidateToken", () => {
    it("Should call jwt library", () => {
      const { sut } = makeSut();
      (verify as jest.Mock).mockReturnValueOnce({ id: "valid_id" });
      sut.decryptToken("any_token", "any_secret");

      expect(verify).toHaveBeenCalledTimes(1);
    });

    it("Should return generated token", () => {
      const { sut } = makeSut();
      (verify as jest.Mock).mockReturnValueOnce({ id: "valid_id" });
      const generatedToken = sut.decryptToken("any_token", "any_secret");

      expect(generatedToken).toBe("valid_id");
    });

    it("Should return undefined if jwt throws", () => {
      const { sut } = makeSut();
      (verify as jest.Mock).mockImplementationOnce(() => throwError());
      const result = sut.decryptToken("any_token", "any_secret");

      expect(result).toBeUndefined();
    });
  });
});
