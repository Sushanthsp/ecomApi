const getUsers = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id= $1";
const checkEmailExists = "SELECT s FROM users s WHERE email = $1";
const addUser = "INSERT INTO users(name,email,password,roles) VALUES($1,$2,$3,$4)"
const deleteUserByName = "DELETE FROM users WHERE id = $1"
const updateUserById = "UPDATE users SET name = $1 ,email =$2,password=$3,roles=$4 WHERE id=$5"
const getUserByEmail = "SELECT * FROM users WHERE email = $1"
const isAdmin = "SELECT roles FROM users WHERE id = $1";
const getProducts = "SELECT * FROM products"
const getProductsById = "SELECT * FROM products WHERE id = $1"
const isAdminAndVendor =  "SELECT roles FROM users WHERE id = $1";
const createProduct = "INSERT INTO products(status,title,pictureUrl,price,createdby) VALUES($1,$2,$3,$4,$5)"
const changeStatusByAdmin ="UPDATE products SET status =$1 where id=$2"
const changeStatusByAdminAndVendor ="UPDATE products SET status ='readyForListing' where id=$1"
const updateProductByAdminAndVendor="UPDATE products SET status=$1, title=$2, pictureurl=$3, price=$4 WHERE id=$5"
const deleteProductsByAdmin = "DELETE FROM products WHERE id = $1"

const getOrders = "SELECT * FROM orders";
const getOrdersById = "SELECT * FROM orders WHERE id=$1"
const updateOrdersById = "UPDATE orders SET status=$1 WHERE id=$2"

module.exports = {
    getUsers,
    getUserById,
    checkEmailExists,
    addUser,
    deleteUserByName,
    updateUserById,
    getUserByEmail,
    isAdmin,
    getProducts,
    getProductsById,
    isAdminAndVendor,
    createProduct,
    changeStatusByAdmin,
    changeStatusByAdminAndVendor,
    updateProductByAdminAndVendor,
    deleteProductsByAdmin,
    getOrders,
    getOrdersById,
    updateOrdersById
};

