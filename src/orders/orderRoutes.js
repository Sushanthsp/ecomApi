const { Router } = require("express");
const controller = require("./orderController");
var fetchuser = require("../../middleWare/fetchUser");

const orderRouter = Router();

//create order by user
orderRouter.post("/createorder/:id", fetchuser, controller.createorder);

//routes to fetch order data from table
orderRouter.get("/", fetchuser, controller.getOrders);
orderRouter.get("/:id", fetchuser, controller.getOrdersById);
orderRouter.put("/:id", fetchuser, controller.updateOrdersById);

module.exports = orderRouter;
