import mongoose, { Model } from "mongoose";
import {
  CreateUserRepositoryInterface,
  UserEntityType,
} from "@/domain/abstract";
import { makeUserEntity } from "@/tests/test-helpers";

mongoose.Promise = global.Promise;

const mongoUri =
  "mongodb+srv://douglasvolcato:Rejane123@cluster0.fc9zbgi.mongodb.net/?retryWrites=true&w=majority";

let UserModel: Model<any>;

beforeAll(async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);

  const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
  });

  UserModel = mongoose.model("User", userSchema);
});

afterAll(async () => {
  await mongoose.connection.close();
});

class CreateUserRepository implements CreateUserRepositoryInterface {
  public async execute(userEntity: UserEntityType): Promise<UserEntityType> {
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser.toObject();
  }
}

type SutTypes = {
  sut: CreateUserRepository;
};

const makeSut = (): SutTypes => {
  const sut = new CreateUserRepository();
  return { sut };
};

describe("CreateUserRepository", () => {
  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("Should create a new user", async () => {
    const { sut } = makeSut();
    const userEntity = makeUserEntity();
    const createdUser = await sut.execute(makeUserEntity());

    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).toBe(userEntity.name);
    expect(createdUser.email).toBe(userEntity.email);
    expect(createdUser.password).toBe(userEntity.password);
  });

  it("Should throw if mongoose throws", async () => {});
});
