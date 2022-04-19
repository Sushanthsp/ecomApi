const pool = require("../../db");
const queries = require("./productsRepository");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//get all products
const getProducts = async (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const getPdt = await queries.getProducts();
  if (!getPdt) {
    res.send("Product does not exist");
  } else {
    res.status(200).send(getPdt.rows);
  }
};

//get all products by their id
const getProductsById = async (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);
  const id = req.params.id;
  const getPdtById = await queries.getProductsById(id);

  if (!getPdtById.rows.length) {
    res.send("product does not exist");
  } else {
    res.status(200).send(getPdtById.rows);
  }
};

//create new products into db

const createProducts = async (req, res) => {
  const { status, title, pictureUrl, price } = req.body;

  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  if (role == "admin" || role == "vendor") {
    const createPdt = await queries.createProduct(
      status,
      title,
      pictureUrl,
      price,
      role
    );

    res.status(200).send("Added products successfully");
  } else {
    res.send("Only Admin or Vendors can add products");
  }
};

//update product status to ready for listing
const pdtToReadyForListing = async (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const pdtToReadyForListing = await queries.getProductsById(id);
  if (!pdtToReadyForListing.rows.length) {
    res.send("product does not exist");
  } else {
    if (role == "admin" || role == "vendor") {
      const changeStatusByAdminAndVendor =
        await queries.changeStatusByAdminAndVendor(id);
      res.status(200).send("Product is ready for listing");
    } else {
      res.send("Only Admin or Vendors can change status");
    }
  }
};

//update product status to active or inactive
const pdtToActiveAndInactive = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const pdtToActiveAndInactive = await queries.getProductsById(id);
  if (!pdtToActiveAndInactive.rows.length) {
    res.send("product does not exist");
  } else {
    if (role == "admin") {
      const changeStatusByAdminAndVendor = await queries.changeStatusByAdmin(
        status,
        id
      );
      res.status(200).send(`Successfully changed product status to ${status}`);
    } else {
      res.send("Only Admin can change status");
    }
  }
};

//update product
const updateProducts = async (req, res) => {
  const id = req.params.id;
  const { status, title, pictureurl, price } = req.body;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const getPdtById = await queries.getProductsById(id);
  if (!getPdtById.rows.length) {
    res.send("product does not exist");
  } else {
    if (role == "admin" || role == "vendor") {
      const updateProductByAdminAndVendor =
        await queries.updateProductByAdminAndVendor(
          status,
          title,
          pictureurl,
          price,
          id
        );
      res.status(200).send(`Updated product successfully`);
    } else {
      res.send("Only Admin or Vendors can update products");
    }
  }
};

//delete products by their id
const deleteProducts = async (req, res) => {
  const id = req.params.id;
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const role = data.roles;
  console.log("role in getproduct " + role);

  const getpdtById = await queries.getProductsById(id);

  if (!getpdtById.rows.length) {
    res.send("product does not exist");
  } else {
    if (role == "admin") {
      await queries.deleteProductsByAdmin(id);
      res.status(200).send("Successfully deleted product");
    } else {
      res.send("Only Admin can delete products");
    }
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProducts,
  pdtToReadyForListing,
  pdtToActiveAndInactive,
  updateProducts,
  deleteProducts,
};
