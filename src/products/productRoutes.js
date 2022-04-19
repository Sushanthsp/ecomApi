const { Router } = require("express");
const controller = require("./productsController");
var fetchuser = require("../../middleWare/fetchUser");

const productRouter = Router();

//routes to fetch products data from table
productRouter.get("/", fetchuser, controller.getProducts);
productRouter.get("/:id", fetchuser, controller.getProductsById);
productRouter.post("/", fetchuser, controller.createProducts);
productRouter.put(
  "/readyforlisting/:id",
  fetchuser,
  controller.pdtToReadyForListing
);
productRouter.put(
  "/activeInactive/:id",
  fetchuser,
  controller.pdtToActiveAndInactive
);
productRouter.put("/update/:id", fetchuser, controller.updateProducts);
productRouter.delete("/delete/:id", fetchuser, controller.deleteProducts);

module.exports = productRouter;
