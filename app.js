const express = require("express");
const morgan = require("morgan");
const moviesRouter = require("./Routes/moviesRouter");
const app = express();

const logger = function (req, res, next) {
  console.log("Steven Smith will be leading a team");
  next();
};

app.use(express.json());
app.use(logger);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static("./public"));

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use("/api/v1/movies", moviesRouter);

module.exports = app;
