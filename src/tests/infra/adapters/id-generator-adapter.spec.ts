import { IdGeneratorAdapter } from "../../../infra/adapters";
import { throwError } from "../../../tests/test-helpers";
import { v4 } from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

type SutTypes = {
  sut: IdGeneratorAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new IdGeneratorAdapter();
  return { sut };
};

describe("IdGeneratorAdapter", () => {
  it("Should call uuid library", () => {
    const { sut } = makeSut();
    sut.generateId();

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it("Should return generated uuid", () => {
    const { sut } = makeSut();
    (v4 as jest.Mock).mockReturnValueOnce("generated_id");
    const generatedUuid = sut.generateId();

    expect(generatedUuid).toBe("generated_id");
  });

  it("Should throw if uuid throws", () => {
    const { sut } = makeSut();
    (v4 as jest.Mock).mockImplementationOnce(() => throwError());

    expect(() => sut.generateId()).toThrow();
  });
});
