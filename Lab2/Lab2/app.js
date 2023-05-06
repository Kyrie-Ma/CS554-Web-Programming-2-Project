const express = require("express");
const configRoutes = require("./routes");
const app = express();

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});