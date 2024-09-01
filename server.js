const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");
console.log(process.env);
const PORT = process.env.PORT;

console.log(process.env.PASSWORD);
// console.log(app.get("env"));

app.listen(PORT, () => {
  console.log(`Your server has been Started at http://localhost:${PORT}`);
});
