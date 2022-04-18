const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecom",
  password: "test",
  port: 5432,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

module.exports = pool;
