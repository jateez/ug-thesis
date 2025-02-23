const pg = require("pg")
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "thesis_db",
  idleTimeoutMillis: 500,
})

module.exports = pool;