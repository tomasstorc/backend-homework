import mongoose, { Schema } from "mongoose";
import IItem from "../interface/item";

export const itemSchema = new Schema<IItem>({
  name: { type: String, required: true, minlength: 3 },
  checked: { type: Boolean, required: true, default: false },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
