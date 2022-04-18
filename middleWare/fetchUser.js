var jwt = require('jsonwebtoken');
require('dotenv').config()

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log(data)
        req.user = data.user;
        const role = data.roles
        console.log("role "+ role)
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchuser;