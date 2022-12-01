import mongoose from "mongoose";
import IItem from "./item";

export default interface IShoppingList {
  name: string;
  items: Array<IItem>;
  owner: mongoose.Types.ObjectId;
  contributors: Array<mongoose.Types.ObjectId>;
}
