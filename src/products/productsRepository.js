const pool = require('../../db')

const getProducts = () => {
  return pool.query("SELECT * FROM products")
}

const getProductsById = (id)=>{
  return pool.query("SELECT * FROM products WHERE id = $1",[id])
}

const isAdminAndVendor = (id)=>{
  return pool.query("SELECT roles FROM products WHERE id = $1",[id])
}

const createProduct = (status,title,pictureurl,price,createdby)=>{
  return pool.query("INSERT INTO products(status,title,pictureurl,price,createdby) VALUES($1,$2,$3,$4,$5)",[status,title,pictureurl,price,createdby])
}

const changeStatusByAdmin = (status,id)=>{
  return pool.query("UPDATE products SET status =$1 where id=$2",[status,id])
}

const changeStatusByAdminAndVendor = (id)=>{
  return pool.query("UPDATE products SET status ='readyForListing' where id=$1",[id])
}

const updateProductByAdminAndVendor = (status, title, pictureUrl, price, id)=>{
  return pool.query("UPDATE products SET status=$1, title=$2, pictureurl=$3, price=$4 WHERE id=$5",[status, title, pictureUrl, price, id])
}

const deleteProductsByAdmin = (id)=>{
  return pool.query("DELETE FROM products WHERE id = $1",[id])
}

module.exports={
  getProducts,
  getProductsById,
  isAdminAndVendor,
  createProduct,
  changeStatusByAdmin,changeStatusByAdminAndVendor,
  updateProductByAdminAndVendor,
  deleteProductsByAdmin,
}