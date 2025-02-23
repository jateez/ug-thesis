const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  console.log(err);
  res.status(status).json({ status_code: status, message });
};

module.exports = errorHandler;

