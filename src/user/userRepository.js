const pool = require('../../db')

const getUsers = () => {
  return pool.query("select * FROM users")
}

const getUserById = (userId) => {
  return pool.query("select * FROM users WHERE id= $1", [userId]);
}

const checkEmailExists = async(email) => {
  return pool.query("SELECT s FROM users s WHERE email = $1", [email]);
}

const addUser = async(name,email,password,roles) => {
  return pool.query("INSERT INTO users(name,email,password,roles) VALUES($1,$2,$3,$4)", [name,email,password,roles]);
}

const deleteUserByName = (userId) => {
  return pool.query("DELETE FROM users WHERE id = $1", [userId]);
}

const updateUserById = async(name,email,password,roles,id) => {
  return pool.query("UPDATE users SET name = $1 ,email =$2,password=$3,roles=$4, WHERE id=$5", [name,email,password,roles,id])
}

const getUserByEmail = async(email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
}

const isAdmin = async(id) => {
  return pool.query("SELECT roles FROM users WHERE id = $1", [id]);
}




module.exports={
  getUsers,
  getUserById,
  checkEmailExists,
  addUser,
  deleteUserByName,
  updateUserById,
  getUserByEmail,
  isAdmin,
}