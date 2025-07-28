const Controller = require("../controllers/index.controller.js");
const MetricController = require("../controllers/prometheus.controller.js");
const errorHandler = require("../middlewares/error.handler.js");
const middleware = require("../middlewares/middleware.js");
const router = require("express").Router();

router.get("/", (_, res, __) => {
  res.json({ message: "Hello World" });
});
router.get("/blogs/orm", Controller.getPostsORM);
router.post("/blogs/orm", Controller.createPostORM);
router.get("/blogs/orm/:id", Controller.getPostORM);
router.get("/blogs/raw-query", Controller.getPostsRaw);
router.get("/blogs/raw-query/:id", Controller.getPostRaw);
router.post("/blogs/raw-query", Controller.createPostRaw);
router.get("/metrics", middleware, MetricController.getMetrics);
router.use(errorHandler);

module.exports = router;
