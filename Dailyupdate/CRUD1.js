const express = require("express");
const fs = require("fs");
const app = express();

let movies = JSON.parse(fs.readFileSync("./Data/movies.json"));

const PORT = 8080;

app.use(express.json());

// mIddleware is stad between req and res
//ROUTE = HTTP METHOD + URL

app.get("/api/v1/movies", (req, res) => {
  res.status(200);
  res.json({
    status: "Success",
    count: movies.length,
    data: {
      movies: movies,
    },
  });
});

//get --> /api/v1/movies/:id

app.get("/api/v1/movies/:id", (req, res) => {
  // console.log(req.params);
  // res.send("generated");

  //CONVERT STRING ID INTO NUMBER BY + OPERATOR or by using req.params.id * 1
  const id = +req.params.id;

  //FIND MOVIE BASED ON ID PARAMETER
  let movie = movies.find((el) => el.id === id);
  if (!movie) {
    res.status(404);
    res.json({
      status: "Failed",
      message: `Movie with ID ${id} is not found`,
    });
  }

  //SEND MOVIE IN TO RESPONSE
  res.status(200);
  res.json({
    status: "Sucess",
    data: {
      movie: movie,
    },
  });
});

//post
app.post("/api/v1/movies", (req, res) => {
  // console.log(req.body);
  const newId = movies[movies.length - 1].id + 1;

  //Object.assign() is basically allows us to create new object by merging to existing object together
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

  // res.send("Created");
});

//patch
app.patch("/api/v1/movies/:id", (req, res) => {
  let id = +req.params.id;
  const updateMovie = movies.find((el) => el.id === id);
  if (!updateMovie) {
    res.status(404).json({
      status: "Failed",
      message: `Your  Movie ID ${id} is not found...`,
    });
  }
  const index = movies.indexOf(updateMovie); //if id will 5 then index no will be 4;
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
});

app.delete("/api/v1/movies/:id", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Your server has been Started at http://localhost:${PORT}`);
});
