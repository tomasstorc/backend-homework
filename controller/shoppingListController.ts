import express, { Request, Response } from "express";
import IShoppingList from "../interface/shoppingList";

import isAuthenticated from "../middleware/isAuthenticated";
import isOwner from "../middleware/isOwner";
import isOwnerOrContributor from "../middleware/isOwnerOrContributor";
import ShoppingList from "../model/ShoppingList";
import ErrorResponse from "../utils/errorResponse";

const router = express.Router();

router.get("/", isAuthenticated, (req: Request, res: Response) => {
  ShoppingList.find(
    { owner: req.user.foundUser._id },
    (err: Error | undefined, lists: Array<IShoppingList>) => {
      if (err) return res.status(400).json({ status: "error", errors: [err] });
      if (lists.length < 1) {
        return res.status(200).json({
          status: "empty",
          errors: [],
          data: "no shopping lists for given user",
        });
      } else {
        return res
          .status(200)
          .json({ status: "success", errors: [], data: lists });
      }
    }
  );
});

// get
router.get(
  "/:id",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    const listId = req.params.id;
    ShoppingList.findById(
      listId,
      (err: Error | undefined, list: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        }
        if (!list) {
          return res
            .status(404)
            .json(new ErrorResponse("error", ["no list found for given id"]));
        } else {
          return res
            .status(200)
            .json({ status: "success", data: list, errors: [] });
        }
      }
    );
  }
);

// create shopping list
router.post("/", isAuthenticated, (req: Request, res: Response) => {
  const body = req.body;
  const _shoppingList = new ShoppingList({
    name: body.name,
    items: body.items,
    owner: req.user.foundUser._id,
    contributors: body.contributors || [],
  });
  _shoppingList.save((err, result) => {
    if (err) {
      return res.status(400).json({ status: "error", errors: [err] });
    } else {
      res.status(201).json({ status: "created", data: result, errors: [] });
    }
  });
});

// delete shopping list
router.delete(
  "/:id",
  isAuthenticated,
  isOwner,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndDelete(req.params.id, (err: Error | undefined) => {
      if (err) {
        return res.status(400).json(new ErrorResponse("error", [err]));
      } else {
        return res.status(200).json({ status: "deleted", errors: [] });
      }
    });
  }
);

// update shopping list
router.put(
  "/:id",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    if (!req.body.name)
      return res
        .status(400)
        .json(new ErrorResponse("error", ["new name not filled"]));
    ShoppingList.findByIdAndUpdate(
      req.params.id,
      req.body,
      (err: Error | undefined, updatedList: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "updated", data: updatedList, errors: [] });
        }
      }
    );
  }
);

// add item to shopping list
router.post(
  "/:listid/item",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listid,
      {
        $push: { items: req.body },
      },
      (err: Error | undefined, updatedList: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "updated", data: updatedList, errors: [] });
        }
      }
    );
  }
);

// rename item in shopping list
router.put(
  "/:listid/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listid,
      {
        $set: { "items.$": { _id: req.params.itemid, name: req.body.name } },
      },
      (err: Error | undefined, updatedList: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "updated", data: updatedList, errors: [] });
        }
      }
    );
  }
);

// delete item from shopping list
router.delete(
  "/:listid/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listid,
      {
        $pull: { items: { _id: req.params.itemid } },
      },
      (err: Error | undefined, updatedList: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "updated", data: updatedList, errors: [] });
        }
      }
    );
  }
);

router.get(
  "/:listid/item/:itemid/mark",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listid,
      {
        $set: { "items.$": { _id: req.params.itemid, checked: true } },
      },
      (err: Error | undefined, updatedList: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "updated", data: updatedList, errors: [] });
        }
      }
    );
  }
);
export default router;
