import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
  name: string;
  sequence: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true },
  sequence: { type: Number, required: true },
});

const Counter = mongoose.model<ICounter>("Counter", counterSchema);

export default Counter;
