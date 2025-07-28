const errorHandler = (err, _, res, __) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  switch (err.name) {
    case "DataNotFound":
      status = 404;
      message = "Data not found. Please input the correct id";

      break;
    case "MissingField":
      status = 400;
      message =
        "Some field input are missing. Please make sure you have already fill all the required field";
      break;
    default:
      break;
  }

  console.log(err);

  res.status(status).json({ status_code: status, message });
};

module.exports = errorHandler;
