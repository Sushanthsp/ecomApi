const pool = require("./../db");
const queries = require("./query");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//fetch all users from table
const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
    console.log({ ...result.rows });
  });
};

//fetch users from table by their id
const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

//adds users into table
const addUser = async (req, res) => {
  const { id, name, email, password, roles } = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (results.rows.length) {
      res.send("email exists");
      return;
    }
    pool.query(
      queries.addUser,
      [name, email, secPass, roles],
      (error, results) => {
        const authtoken = jwt.sign(
          { name, email, password, roles },
          process.env.JWT_SECRET
        );
        if (error) throw error;
        res.status(201).json(authtoken);
      }
    );
  });
};

//login to the existing user table
const login = async (req, res) => {
  const { email, password } = req.body;
  pool.query(queries.getUserByEmail, [email], (error, results) => {
    if (!results.rows.length) {
      return res.send("no user found");
    }
    const passwordCompare = bcrypt.compare(password, results.rows[0].password);
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Please try to login with correct credentials",
      });
    } else {
      const authtoken = jwt.sign({ email, password }, process.env.JWT_SECRET);
      if (error) throw error;
      res.status(201).json(authtoken);
    }
  });
};

//remove user by their id
const removeUserByName = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, result) => {
    if (!result.rows.length) {
      res.send("no user found");
      return;
    }

    pool.query(queries.isAdmin, [id], (error, result) => {
      if (result.rows[0].roles != "admin") {
        res.send("cannot delete user, You're not an admin");
        return;
      } else {
        pool.query(queries.deleteUserByName, [id], (error, results) => {
          if (error) throw error;
          res.status(200).send("user deleted successfully");
        });
      }
    });
  });
};

//update users by their id
const updateUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, roles } = req.body;
  pool.query(queries.getUserById, [id], (error, results) => {
    const noStudentFound = !results.rows.length;
    if (noStudentFound) {
      res.send("no user exists");
      return;
    }

    pool.query(
      queries.updateUserById,
      [name, email, password, roles, id],
      (error, results) => {
        if (error) throw error;
        res.status(200).send("user updated successfully");
      }
    );
  });
};

//get all products
const getProducts = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProducts, (error, result) => {
    if (error) throw error;
    res.status(200).send(result.rows);
  });
};

//get all products by their id
const getProductsById = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);
  const id = req.params.id;
  pool.query(queries.getProductsById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      res.status(200).send(result.rows);
    }
  });
};

//create new products into db

const createProducts = (req, res) => {
  const { status, title, pictureUrl, price, createdby } = req.body;

  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  if (role == "admin" || role == "vendor") {
    pool.query(
      queries.createProduct,
      [status, title, pictureUrl, price, createdby],
      (error, result) => {
        if (error) throw error;
        res.status(200).send("Added products successfully");
      }
    );
  } else {
    res.send("Only Admin or Vendors can add products");
  }
};

//update product status to ready for listing
const pdtToReadyForListing = (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProductsById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      if (role == "admin" || role == "vendor") {
        pool.query(
          queries.changeStatusByAdminAndVendor,
          [id],
          (error, result) => {
            if (error) throw error;

            res.status(200).send("Product is ready for listing");
          }
        );
      } else {
        res.send("Only Admin or Vendors can change status");
      }
    }
  });
};

//update product status to active or inactive
const pdtToActiveAndInactive = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProductsById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      if (role == "admin") {
        pool.query(
          queries.changeStatusByAdmin,
          [status, id],
          (error, result) => {
            if (error) throw error;

            res
              .status(200)
              .send(`Successfully changed product status to ${status}`);
          }
        );
      } else {
        res.send("Only Admin can change status");
      }
    }
  });
};

//update product
const updateProducts = (req, res) => {
  const id = req.params.id;
  const { status, title, pictureUrl, price } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProductsById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      if (role == "admin" || role == "vendor") {
        pool.query(
          queries.updateProductByAdminAndVendor,
          [status, title, pictureUrl, price, id],
          (error, result) => {
            if (error) throw error;

            res.status(200).send("Updated product successfully");
          }
        );
      } else {
        res.send("Only Admin or Vendors can update products");
      }
    }
  });
};

//delete products by their id
const deleteProducts = (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProductsById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      if (role == "admin") {
        pool.query(queries.deleteProductsByAdmin, [id], (error, result) => {
          if (error) throw error;

          res.status(200).send("Successfully deleted product");
        });
      } else {
        res.send("Only Admin can delete products");
      }
    }
  });
};

//get all orders from table
const getOrders = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getOrders, (error, result) => {
    if (error) throw error;
    res.status(200).send(result.rows);
  });
};

//get order by id
const getOrdersById = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);
  const id = req.params.id;
  pool.query(queries.getOrdersById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      res.status(200).send(result.rows);
    }
  });
};

//update orders by their id
const updateOrdersById = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getOrdersById, [id], (error, result) => {
    if (error) throw error;
    if (!result.rows.length) {
      res.send("product does not exist");
    } else {
      if (role == "admin") {
        pool.query(queries.updateOrdersById, [status, id], (error, result) => {
          if (error) throw error;

          res.status(200).send("Updated order successfully");
        });
      } else {
        res.send("Only Admin or Vendors can update products");
      }
    }
  });
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
const createorder = (req, res) => {
  const id = req.params.id;
  const { bodyId } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  console.log(data.email);
  let identity = 0;
  var totalprice = 0;
  let totalItems = 0;
  
  //   pool.query(queries.getId, [data.email], (error, result) => {
  //     console.log(result.rows[0].id);
  //     identity = result.rows[0].id;})
  pool.query(queries.totalItems, [id], (error, results) => {
    return (totalItems = results.rows);
  });
  pool.query(queries.countTotalPrice, [id], (error, results) => {
    return (totalprice = results.rows[0]);
  });
  
  for (let i = 0; i < bodyId.length; i++) {
    pool.query(
      queries.getProductsById,
      [parseInt(bodyId[i])],
      (error, result) => {
        if (error) throw error;
        if (!result.rows.length) {
          res.send(`${bodyId[i]}th product does not exist`);
        } else {
        //   console.log("result.rows");
        //   console.log(result.rows[0]);
        //   console.log("bodyId[i]");
        //   console.log(bodyId[i]);
          pool.query(
            queries.createOrder,
            [
              result.rows[0].title,
              result.rows[0].price,
              result.rows[0].createdby,
              id,
            ],
            (error, results) => {
              if (error) throw error;
              console.log("totalItems");
              console.log(totalItems);
              console.log("totalprice");
              console.log(totalprice);
            }
          );
        }
      }
    );
  }

  

  res.send("created buy order successfully");
};

module.exports = {
  getUsers,
  getUsersById,
  addUser,
  removeUserByName,
  updateUserById,
  login,
  getProducts,
  getProductsById,
  createProducts,
  pdtToReadyForListing,
  pdtToActiveAndInactive,
  updateProducts,
  deleteProducts,
  getOrders,
  getOrdersById,
  updateOrdersById,
  createorder,
};
