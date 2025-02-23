const express = require("express");

const router = require("./routes/index.route.js");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

