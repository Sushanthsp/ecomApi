const pool = require('../../db')

const getOrders = () => {
  return pool.query("SELECT * FROM buyorder")
}

const getOrdersById = (id) => {
  return pool.query("SELECT * FROM buyorder WHERE id=$1",[id])
}
const getProductsById = (id)=>{
  return pool.query("SELECT * FROM products WHERE id = $1",[id])
}
const updateOrdersById = (status,id) => {
  return pool.query("UPDATE buyorder SET status=$1 WHERE id=$2",[status,id])
}

const createOrder = (items,totalprice,createdby,refid) => {
  return pool.query("INSERT INTO buyorder(items,totalprice,createdby,refid) VALUES($1,$2,$3,$4)",[items,totalprice,createdby,refid])
}

const getId = (email) => {
  return pool.query("SELECT id from users where email = $1",[email])
}

const countTotalPrice = (refid) => {
  return pool.query("SELECT SUM(totalprice) FROM buyorder WHERE refid=$1",[refid])
}

const totalItems = (refid) => {
  return pool.query("SELECT ITEMS FROM buyorder WHERE refid = $1",[refid])
}

const  combineArray= (array1, array2)=> {
  return [...array1, ...array2];
}
module.exports={
  getOrders,
  getOrdersById,
  updateOrdersById,
  createOrder,
  getId,
  countTotalPrice,
  totalItems,
  getProductsById,
  combineArray
}