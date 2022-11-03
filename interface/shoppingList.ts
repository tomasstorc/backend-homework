import mongoose from "mongoose";

export default interface IShoppingList {
  name: String;
  items: mongoose.Schema.Types.ObjectId;
  owner: mongoose.Schema.Types.ObjectId;
  contributors: mongoose.Schema.Types.ObjectId;
}
