const prisma = require("../prisma/client.js");
const pool = require("../raw-query/connection.js");

class Controller {
  static async getPostsORM(req, res, next) {
    try {
      const { q } = req.query;
      const pageNum = q && !isNaN(parseInt(q)) ? parseInt(q) : 0;

      let blogs;

      if (pageNum > 0) {
        blogs = await prisma.blogs.findMany({
          take: 10,
          skip: 10 * (pageNum - 1),
          orderBy: { id: "asc" },
        });
        return res.status(200).json({
          status_code: "200 OK",
          message: "Successfully retrieved blog data with ORM",
          data: blogs,
          page_number: pageNum,
        });
      } else {
        blogs = await prisma.blogs.findMany({
          orderBy: { id: "asc" },
        });
        return res.status(200).json({
          status_code: "200 OK",
          message: "Successfully retrieved blog data with ORM",
          data: blogs,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getPostORM(req, res, next) {
    try {
      const { id } = req.params;
      const result = await prisma.blogs.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      if (!result) {
        throw { name: "DataNotFound" };
      }
      res.status(200).json({
        status_code: "200 OK",
        message: `Successfully retrieved blog with id ${id} data with ORM`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
  static async getPostsRaw(req, res, next) {
    try {
      const { q } = req.query;
      let query = {
        text: "",
        values: [],
      };

      const pageNum = q && !isNaN(parseInt(q)) ? parseInt(q) : 0;

      if (pageNum > 0) {
        query.text = `
      SELECT * FROM "Blogs" b
      WHERE b.id > $1
      ORDER BY b.id
      LIMIT 10`;
        query.values = [10 * (pageNum - 1)];
      } else {
        query.text = `
        SELECT * FROM "Blogs" b
          ORDER BY b.id`;
        query.values = [];
      }

      const result = await pool.query(query);

      if (pageNum > 0) {
        return res.status(200).json({
          status_code: "200 OK",
          message: "Successfully retrieved blog data with Raw Query",
          data: result.rows,
          page_number: pageNum,
        });
      } else {
        return res.status(200).json({
          status_code: "200 OK",
          message: "Successfully retrieved blog data with Raw Query",
          data: result.rows,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getPostRaw(req, res, next) {
    try {
      const { id } = req.params;
      const query = {
        text: `
      SELECT * FROM "Blogs" b
      WHERE b.id = $1
      `,
        values: [id],
      };

      const result = await pool.query(query);

      if (result.rows.length === 0) throw { name: "DataNotFound" };

      res.status(200).json({
        status_code: "200 OK",
        message: `Successfully retrieved blog with id ${id} data with Raw Query`,
        data: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  }
  static async createPostORM(req, res, next) {
    try {
      const { title, content, author } = req.body;

      if (!title || !author || !content) throw { message: "MissingField" };

      const result = await prisma.blogs.create({
        data: {
          title,
          content,
          author,
        },
      });
      res.status(201).json({
        status_code: "201 CREATED",
        message: "Successfully created blog post with ORM",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPostRaw(req, res, next) {
    try {
      const { title, content, author } = req.body;

      if (!title || !author || !content) throw { message: "MissingField" };
      const query = {
        text: 'INSERT INTO "Blogs" ("title", "author", "content") VALUES ($1, $2, $3) RETURNING *',
        values: [title, author, content],
      };

      const result = await pool.query(query);

      res.status(201).json({
        status_code: "201 CREATED",
        message: "Successfully created blog post with Raw Query",
        data: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
