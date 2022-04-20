const pool = require("../../db");
const queries = require("./userRepository");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//fetch all users from table
const getUsers = async (req, res) => {
  try {
    const users = await queries.getUsers();
    if (users === null) {
      throw new error("user does not exisst");
    } else {
      res.json(users.rows);
    }
  } catch (error) {
    throw error
  }
 
};

//fetch users from table by their id
const getUsersById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const getUser = await queries.getUserById(id);
  if (getUser === null) {
    throw new error("user does not exisst");
  } else {
    res.json(getUser.rows);
  }
  } catch (error) {
    throw error;
  }
  
};

//adds users into table
const addUser = async (req, res) => {
  const { id, name, email, password, roles } = req.body;


  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);
  try {
  const checkEmail = await queries.checkEmailExists(email);

  if (checkEmail.rows.length) {
    res.send("email exists");
    return;
  } else {
    
      await queries.addUser(name, email, secPass, roles);
      const authtoken = jwt.sign(
        { name, email, password, roles },
        process.env.JWT_SECRET
      );
      res.status(200).send(authtoken);
    } 
  }
  catch (err) {
    throw err;
  }
};

//login to the existing user table
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const getUserByEmail = await queries.getUserByEmail(email);
  if (!getUserByEmail.rows[0]) {
    return res.send("no user found");
  }

  const passwordCompare = await bcrypt.compare(
    password,
    getUserByEmail.rows[0].password
  );
  } catch (error) {
    throw error
  }
  

  try {
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Please try to login with correct credentials",
      });
    } else {
      const authtoken = jwt.sign({ email, password }, process.env.JWT_SECRET);
      res.status(201).json(authtoken);
    }
  } catch (error) {
    throw error
  }
  
};

//remove user by their id
const removeUserByName = async (req, res) => {
  const id = parseInt(req.params.id);

  
try {
  const getUser = await queries.getUserById(id);
  console.log(id);
  console.log(getUser.rows);
} catch (error) {
  throw error
}

  try {
    if (getUser.rows == 0) {
      await res.send("No user exist");
    } else {
      const isAdmin = await queries.isAdmin(id);
      if (isAdmin.rows[0].roles != "admin") {
        await res.send("cannot delete user, You're not an admin");
      } else {
      const del =  await queries.deleteUserByName(id);
        res.status(200).send("user deleted successfully");
      }
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

//update users by their id
const updateUserById =async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, roles } = req.body;

  try {
    const getUser = await queries.getUserById(id);
    console.log(id);
    console.log(getUser.rows);
  } catch (error) {
    throw error
  }
 

  try {
    if (getUser.rows == 0) {
      await res.send("No user exist");
    } 
    else 
    {
      await queries.updateUserById(name, email, password, roles, id)
      res.status(200).send("user updated successfully");
    }  
}
catch (err) {
  console.log(err.message);
  throw err;
}
}

module.exports = {
  getUsers,
  getUsersById,
  addUser,
  removeUserByName,
  updateUserById,
  login,
};
