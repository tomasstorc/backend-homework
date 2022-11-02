import mongoose, { Schema } from "mongoose";
import IUser from "../interface/user";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 3, maxlength: 15 },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
