<<<<<<< HEAD
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Render 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
=======

>>>>>>> 9851c3e3d4fcc123e3340d64bf3c530770d0b154
