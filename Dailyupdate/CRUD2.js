const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

let movies = JSON.parse(fs.readFileSync("./Data/movies.json"));

const PORT = 8080;
const logger = function (req, res, next) {
  console.log("Steven Smith will be leading a team");
  next();
};

app.use(express.json());
app.use(logger);
app.use(morgan("dev"));
// mIddleware is stad between req and res

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
//ROUTE = HTTP METHOD + URL

//ROUTE HANDLER FUNCTIONS

const getAllMovies = (req, res) => {
  res.status(200);
  res.json({
    status: "Success",
    requestedAt: req.requestedAt,
    count: movies.length,
    data: {
      movies: movies,
    },
  });
};

const getMovie = (req, res) => {
  const id = +req.params.id;

  let movie = movies.find((el) => el.id === id);
  if (!movie) {
    res.status(404);
    res.json({
      status: "Failed",
      message: `Movie with ID ${id} is not found`,
    });
  }

  res.status(200);
  res.json({
    status: "Sucess",
    data: {
      movie: movie,
    },
  });
};

const createMovie = (req, res) => {
  const newId = movies[movies.length - 1].id + 1;

  const newMovie = Object.assign({ id: newId }, req.body);

  movies.push(newMovie);
  fs.writeFile("./Data/movies.json", JSON.stringify(movies), (err) => {
    res.status(201).json({
      status: "Sucess",
      data: {
        movie: newMovie,
      },
    });
  });
};

const updateMovie = (req, res) => {
  let id = +req.params.id;
  const updateMovie = movies.find((el) => el.id === id);
  if (!updateMovie) {
    res.status(404).json({
      status: "Failed",
      message: `Your  Movie ID ${id} is not found...`,
    });
  }
  const index = movies.indexOf(updateMovie);
  Object.assign(updateMovie, req.body);
  movies[index] = updateMovie;

  fs.writeFile("./Data/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "Sucess",
      data: {
        movie: updateMovie,
      },
    });
  });
};

const deleteMovie = (req, res) => {
  let id = +req.params.id;
  const deleteMovie = movies.find((el) => el.id === id);
  const index = movies.indexOf(deleteMovie);
  movies.splice(index, 1);
  fs.writeFile("./Data/movies.json", JSON.stringify(movies), (err) => {
    res.status(204).json({
      status: "Sucess",
      data: {
        movie: null,
      },
    });
  });
};

// app.get("/api/v1/movies", getAllMovies);
// app.get("/api/v1/movies/:id", getMovie);
// app.post("/api/v1/movies", createMovie);
// app.patch("/api/v1/movies/:id", updateMovie);
// app.delete("/api/v1/movies/:id", deleteMovie);

app.route("/api/v1/movies").get(getAllMovies).post(createMovie);

app
  .route("/api/v1/movies/:id")
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie);
app.listen(PORT, () => {
  console.log(`Your server has been Started at http://localhost:${PORT}`);
});
