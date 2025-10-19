const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config();
require("./init/mongodb")();
const { authRoute } = require("./routes");
const { errorHandler } = require("./middleware");
const notfound = require("./controllers/notfound");

const app = express();

// Third-party middleware
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

app.use(express.json({ limit: "500mb" }));
app.use(morgan("dev"));

//route section
app.use("/api/v1/auth", authRoute);

// not found route
app.use(notfound);

// error handling middleware
app.use(errorHandler);

module.exports = app;
