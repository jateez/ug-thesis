const prisma = require("../prisma/client.js");
const pool = require("../raw-query/connection.js");

class Controller {
  static async getPostORM(_, res, next) {
    try {
      const blogs = await prisma.blogs.findMany({});

      res.status(200).json({
        status_code: "200 OK",
        message: "Successfully retrieved Blogs data with ORM",
        data: blogs,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPostRaw(_, res, next) {
    try {
      const query = `
      SELECT * FROM "Blogs" b
          ORDER BY b.id;
      `;

      let result = await pool.query(query);
      result = result.rows;

      res.status(200).json({
        status_code: "200 OK",
        message: "Successfully retrieved Blogs data with Raw Query",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
  static async createPostORM(req, res, next) {
    try {
      const { title, content, author } = req.body;

      if (!title || !author) throw { message: "MissingField" };

      await prisma.blogs.create({
        data: {
          title,
          content,
          author,
        },
      });
      res.status(201).json({
        status_code: "201 CREATED",
        message: "Successfully created blog post with ORM",
        data: { title, content, author },
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPostRaw(req, res, next) {
    try {
      const { title, content, author } = req.body;

      if (!title || !author) throw { message: "MissingField" };
      const query = `
      INSERT INTO "Blogs" ("title", "author", "content") VALUES  
      ('${title}', '${author}', '${content}')
        `;

      await pool.query(query);

      res.status(201).json({
        status_code: "201 CREATED",
        message: "Successfully created blog post with Raw Query",
        data: { title, content, author },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
