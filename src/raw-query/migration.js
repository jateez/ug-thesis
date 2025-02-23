const pool = require("./connection.js");

(async () => {
  try {
    const dropTables = `DROP TABLES IF EXISTS "Blogs";`;

    const createBlogs = `CREATE TABLE IF NOT EXISTS "Blogs" 
      "id" SERIAL UNIQUE PRIMARY KEY,
      "title" VARCHAR(255),
      "author" VARCHAR(255),
      "content" TEXT,
  );
    `;

    await pool.query(dropTables);
    console.log("SUCCESS DROPPED TABLE");
    await pool.query(createBlogs);
    console.log("SUCCESS CREATED TABLE BLOGS");
  } catch (err) {
    console.log("ERROR CREATING TABLE:", err);
    pool.end();
    throw err;
  }
})();
