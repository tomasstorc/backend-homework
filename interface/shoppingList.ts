import mongoose from "mongoose";

export default interface IShoppingList extends mongoose.Document {
  name: String;
  items: mongoose.Schema.Types.ObjectId;
  owner: mongoose.Schema.Types.ObjectId;
  contributors: Array<mongoose.Schema.Types.ObjectId>;
}
