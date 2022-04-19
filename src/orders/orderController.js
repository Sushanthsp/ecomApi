const pool = require("../../db");
const queries = require("./orderRepository");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//get all orders from table
const getOrders = async (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const getOrder = await queries.getOrders();

  if (!getOrder) {
    res.send("order does not exist");
  } else {
    res.status(200).send(getOrder.rows);
  }
};

//get order by id
const getOrdersById = async (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);
  const id = req.params.id;

  const getOrderById = await queries.getOrdersById(id);

  if (!getOrderById) {
    res.send("order does not exist");
  } else {
    res.status(200).send(getOrderById.rows);
  }
};

//update orders by their id
const updateOrdersById = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const getPdtById = await queries.getOrdersById(id);

  if (!getPdtById) {
    res.send("product does not exist");
  } else {
    if (role == "admin") {
      const updateOrder = await queries.updateOrdersById(status, id);
      res.status(200).send("Updated order successfully");
    } else {
      res.send("Only Admin or Vendors can update products");
    }
  }
};

// const createorder = (req, res) => {
//   const id = req.params.id;
//   const token = req.header("auth-token");
//   const data = jwt.verify(token, process.env.JWT_SECRET);
//   const role = data.roles;
//   console.log("role in getproduct " + role);

//   pool.query(queries.getProductsById, [id], (error, result) => {
//     if (error) throw error;
//     if (!result.rows.length) {
//       res.send("product does not exist");
//     } else {
//       pool.query(
//         queries.createOrder,
//         [result.rows[0].title, result.rows[0].price, result.rows[0].createdby],
//         (error, results) => {
//           if (error) throw error;
//           res.status(200).send(result.rows);
//         }
//       );
//     }
//   });
// };

//create buy order and count total price
const createorder = async (req, res) => {
  const id = req.params.id;
  const { bodyId } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  console.log("data.role " +data.roles );
  //   let identity = 0;
  //   var totalprice = 0;
  //   let totalItems = 0;

//   const identity = await queries.getId(data.email);
//   console.log(identity.rows[0]);

  

  for (let i = 0; i < bodyId.length; i++) {
    const getId = await queries.getProductsById(bodyId[i]);
    console.log(getId.rows)
    if (getId.rows.length===0) {
      res.send(`${bodyId[i]}th product does not exist`);
    } else {
      const createorder = await queries.createOrder(
        getId.rows[0].title,
        getId.rows[0].price,
        data.roles,
        id
      );
    }
  }
  const totalItems = await queries.totalItems(id);
  const countTotalPrice = await queries.countTotalPrice(id);
//   const arr = totalItems.concat(countTotalPrice)
//   console.log(totalItems.rows)
//   console.log(countTotalPrice.rows)
// const array3 = [...totalItems,...countTotalPrice]
const combine =  queries.combineArray(totalItems.rows,countTotalPrice.rows)
console.log(combine)
  res.send( ["created buy order successfully",...combine]);
};

module.exports = {
  getOrders,
  getOrdersById,
  updateOrdersById,
  createorder,
};
