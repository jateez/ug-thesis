const Controller = require("../controllers/index.controller.js");
const errorHandler = require("../middlewares/error.handler.js");

const router = require("express").Router();

router.get("/", (_, res, __) => {
  res.json({ message: "Hello World" });
});
router.get("/blogs", Controller.getPostORM);
router.get("/blogs/raw-query", Controller.getPostRaw);
router.post("/blogs", Controller.createPostORM);
router.post("/blogs/raw-query", Controller.createPostRaw);
router.use(errorHandler);

module.exports = router;

