const fs = require("fs");

let movies = JSON.parse(fs.readFileSync("./Data/movies.json"));

exports.checkId = (req, res, next, value) => {
  console.log("Your enterd id is " + value);

  let movie = movies.find((el) => el.id === +value);
  if (!movie) {
    return res.status(404).json({
      status: "Failed",
      message: `Movie with ID ${value} is not found`,
    });
  }
  next();
};

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.releaseYear || !req.body.duration) {
    return res
      .status(400)
      .json({ status: "failed", message: "Entered data is not valid" });
  }
  next();
};
exports.getAllMovies = (req, res) => {
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

exports.getMovie = (req, res) => {
  const id = +req.params.id;

  let movie = movies.find((el) => el.id === id);
  // if (!movie) {
  //   res.status(404);
  //   res.json({
  //     status: "Failed",
  //     message: `Movie with ID ${id} is not found`,
  //   });
  // }

  res.status(200);
  res.json({
    status: "Sucess",
    data: {
      movie: movie,
    },
  });
};

exports.createMovie = (req, res) => {
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

exports.updateMovie = (req, res) => {
  let id = +req.params.id;
  const updateMovie = movies.find((el) => el.id === id);
  // if (!updateMovie) {
  //   res.status(404).json({
  //     status: "Failed",
  //     message: `Your  Movie ID ${id} is not found...`,
  //   });
  // }
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

exports.deleteMovie = (req, res) => {
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
