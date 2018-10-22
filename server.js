const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTreact";
const db = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);
// Use apiRoutes
//app.use("/api", apiRoutes);
require("./routes/apiRoutes.js")(app);

// app.get("/api/articles", (req, res) => {
//   console.log("just a check");
//   db.Article.create({
//     title: "Stocks are Down",
//     date: "06/07/2018",
//     url: "http://www.aol.com"
//   })
//     .then(response => res.send("it worked"))
//     .catch(err => console.log(err));
// });

// Send every request to the React app
// Define any API routes before this runs
if (process.env.NODE_ENV === "production") {
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
