import mongoose, { Schema } from "mongoose";
import IShoppingList from "../interface/shoppingList";
import { itemSchema } from "./Item";

const shoppingListSchema = new Schema<IShoppingList>({
  name: { type: String, required: true },
  items: [itemSchema],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  contributors: { type: Schema.Types.Mixed, ref: "User" },
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);
export default ShoppingList;
