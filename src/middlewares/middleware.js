const httpRequestDuration = require("../controllers/prometheus.controller.js");

const middleware = (err, req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.path, res.statusCode.toString())
      .observe(duration);
  });
  next();
};

module.exports = middleware;
