const client = require("prom-client");
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

class Controller {
  static async getMetrics(req, res, next) {
    try {
      res.set("Content-Type", register.contentType);
      const metrics = await register.metrics();
      res.send(metrics);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = Controller;
module.exports.httpRequestDuration = httpRequestDuration;
