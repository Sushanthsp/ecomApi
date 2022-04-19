const { Router } = require("express");
const controller = require("./userController");
var fetchuser = require("../../middleWare/fetchUser");

const userRouter = Router();

//routes to fetch user data from table
userRouter.get("/", controller.getUsers);
userRouter.post("/", controller.addUser);
userRouter.get("/:id", controller.getUsersById);
userRouter.delete("/:id", fetchuser, controller.removeUserByName);
userRouter.put("/:id", controller.updateUserById);
userRouter.post("/login", controller.login);

module.exports = userRouter;
