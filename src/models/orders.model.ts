import mongoose, { Document, Schema, Types } from "mongoose";
import { IProduct } from "./product.model";

export enum OrderTypes {
  Pending = 1,
  Dispatched = 2,
  Rejected = 3,
}

export interface IOrders extends Document {
  name: string;
  email: string;
  totalOrderPrice: number;
  products: {
    productId: IProduct;
    quantity: number;
  }[];
  status: OrderTypes;
  createdAt: Date;
  updatedAt: Date;
}

const ordersSchema = new Schema<IOrders>(
  {
    products: [
      {
        productId: { type: Types.ObjectId, required: true, ref: "Products" },
        quantity: { type: Number, required: true },
      },
    ],
    totalOrderPrice: { type: Number, required: true },
    status: {
      type: Number,
      required: true,
      default: OrderTypes.Pending,
      enum: [OrderTypes.Dispatched, OrderTypes.Rejected, OrderTypes.Pending],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrders>("Orders", ordersSchema);

export default Order;
