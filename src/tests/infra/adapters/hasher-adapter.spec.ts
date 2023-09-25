import { HasherAdapter } from "@/infra/adapters";
import { throwError } from "@/tests/test-helpers";
import { hashSync } from "bcrypt";

jest.mock("bcrypt", () => ({
  hashSync: jest.fn(),
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

  it("Should throw if bscrypt throws", () => {
    const { sut } = makeSut();
    (hashSync as jest.Mock).mockImplementationOnce(() => throwError());

    expect(() => sut.hash("any_value")).toThrow();
  });
});
