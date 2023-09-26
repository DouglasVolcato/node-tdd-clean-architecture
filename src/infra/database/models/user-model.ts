import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
});

export const UserModel: Model<any> = mongoose.model("User", userSchema);
