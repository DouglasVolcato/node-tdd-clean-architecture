import { HasherAdapter } from "../../../src/infra/adapters";
import { throwError } from "../../../tests/test-helpers";
import { hashSync, compareSync } from "bcrypt";

jest.mock("bcrypt", () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

type SutTypes = {
  sut: HasherAdapter;
  hashSalt: number;
};

const makeSut = (): SutTypes => {
  const hashSalt = 10;
  const sut = new HasherAdapter(10);
  return { sut, hashSalt };
};

describe("HasherAdapter", () => {
  describe("hash", () => {
    it("Should call hash method with correct value", () => {
      const { sut, hashSalt } = makeSut();
      sut.hash("any_value");

      expect(hashSync).toHaveBeenCalledWith("any_value", hashSalt);
      expect(hashSync).toHaveBeenCalledTimes(1);
    });

    it("Should return the generated hash", () => {
      const { sut } = makeSut();
      (hashSync as jest.Mock).mockReturnValueOnce("generated_hash");
      const generatedHash = sut.hash("any_value");

      expect(generatedHash).toBe("generated_hash");
    });

    it("Should throw if bcrypt throws", () => {
      const { sut } = makeSut();
      (hashSync as jest.Mock).mockImplementationOnce(() => throwError());

      expect(() => sut.hash("any_value")).toThrow();
    });
  });

  describe("validate", () => {
    it("Should call validate method with correct value", () => {
      const { sut } = makeSut();
      sut.validate("any_value", "hashed_value");

      expect(compareSync).toHaveBeenCalledWith("any_value", "hashed_value");
      expect(compareSync).toHaveBeenCalledTimes(1);
    });

    it("Should return true if bcrypt returns true", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockReturnValueOnce(true);
      const generatedHash = sut.validate("any_value", "hashed_value");

      expect(generatedHash).toBeTruthy();
    });

    it("Should return true if bcrypt returns true", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockReturnValueOnce(false);
      const generatedHash = sut.validate("any_value", "hashed_value");

      expect(generatedHash).toBeFalsy();
    });

    it("Should throw if bcrypt throws", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockImplementationOnce(() => throwError());

      expect(() => sut.validate("any_value", "hashed_value")).toThrow();
    });
  });
});
