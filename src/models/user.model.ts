import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserTypes {
  ADMIN = 1,
  USER = 2,
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserTypes;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: Number,
    required: true,
    default: 2,
    enum: [UserTypes.ADMIN, UserTypes.USER],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
