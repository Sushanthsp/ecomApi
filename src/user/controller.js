const pool = require("../../db");
const queries = require("./query");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "123456$oy";

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
    console.log({ ...result.rows });
  });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

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
          { id, name, email, password, roles },
          JWT_SECRET
        );
        if (error) throw error;
        res.status(201).json(authtoken);
      }
    );
  });
};

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
      const authtoken = jwt.sign(results.rows[0].password, JWT_SECRET);
      if (error) throw error;
      res.status(201).json(authtoken);
    }
  });
};

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

const getProducts = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  pool.query(queries.getProducts, (error, result) => {
    if (error) throw error;
    res.status(200).send(result.rows);
  });
};

const getProductsById = (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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

const createProducts = (req, res) => {
  const { status, title, pictureUrl, price, createdby } = req.body;

  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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

const pdtToReadyForListing = (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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

const pdtToActiveAndInactive = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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

const updateProducts = (req, res) => {
  const id = req.params.id;
  const { status, title, pictureUrl, price } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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

const deleteProducts = (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_SECRET);
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
};

// const {
//   create,
//   getUserByUserEmail,
//   getUserByUserId,
//   getUsers,
//   updateUser,
//   deleteUser
// } = require("./query");
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");
// const { sign } = require("jsonwebtoken");

// module.exports = {
//   createUser: (req, res) => {
//     const body = req.body;
//     const salt = genSaltSync(10);
//     body.password = hashSync(body.password, salt);
//     create(body, (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           success: 0,
//           message: "Database connection errror"
//         });
//       }
//       return res.status(200).json({
//         success: 1,
//         data: results
//       });
//     });
//   },
//   login: (req, res) => {
//     const body = req.body;
//     getUserByUserEmail(body.email, (err, results) => {
//       if (err) {
//         console.log(err);
//       }
//       if (!results) {
//         return res.json({
//           success: 0,
//           data: "Invalid email or password"
//         });
//       }
//       const result = compareSync(body.password, results.password);
//       if (result) {
//         results.password = undefined;
//         const jsontoken = sign({ result: results }, "qwe1234", {
//           expiresIn: "1h"
//         });
//         return res.json({
//           success: 1,
//           message: "login successfully",
//           token: jsontoken
//         });
//       } else {
//         return res.json({
//           success: 0,
//           data: "Invalid email or password"
//         });
//       }
//     });
//   },
//   getUserByUserId: (req, res) => {
//     const id = req.params.id;
//     getUserByUserId(id, (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       if (!results) {
//         return res.json({
//           success: 0,
//           message: "Record not Found"
//         });
//       }
//       results.password = undefined;
//       return res.json({
//         success: 1,
//         data: results
//       });
//     });
//   },
//   getUsers: (req, res) => {
//     getUsers((err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       return res.json({
//         success: 1,
//         data: results
//       });
//     });
//   },
//   updateUsers: (req, res) => {
//     const body = req.body;
//     const salt = genSaltSync(10);
//     body.password = hashSync(body.password, salt);
//     updateUser(body, (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       return res.json({
//         success: 1,
//         message: "updated successfully"
//       });
//     });
//   },
//   deleteUser: (req, res) => {
//     const data = req.body;
//     deleteUser(data, (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       if (!results) {
//         return res.json({
//           success: 0,
//           message: "Record Not Found"
//         });
//       }
//       return res.json({
//         success: 1,
//         message: "user deleted successfully"
//       });
//     });
//   }
// };
