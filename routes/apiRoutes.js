const db = require("../models");

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = app => {
  app.get("/api/articles", (req, res) => {
    db.Article.find({})
      .then(response => res.json(response))
      .catch(err => console.log(err));
  });

  app.post("/api/articles", (req, res) => {
    db.Article.create(req.body)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  });

  app.delete("/api/articles/:id", (req, res) => {
    db.Article.findOneAndDelete({
      _id: req.params.id
    })
      .then(response => res.json(response))
      .catch(err => console.log(err));
  });

  app.get("/api/scrape", function(req, res) {
    // Make a request for the news section of `nytimes`
    axios.get("https://nytimes.com").then(function(response) {
      let $ = cheerio.load(response.data); //setting the variable of our scaper so it can be utilized with the same syntax as jquery

      let results = [];

      $(".css-ki19g7").each(function(i, element) {
        console.log("this is the number of elements: ", i);

        let title = $(element)
          .children()
          .find("h3")
          .text();
        let url =
          `https://www.nytimes.com` +
          $(element)
            .children()
            .find("a")
            .attr("href") +
          `?action=click&module=Top%20Stories&amp;pgtype=Homepage`;
        let date = new Date().toString();
        //console.log(label)
        if (title && url && date) {
          results.push({
            title,
            url,
            date
          });
        }
      });
      //console.log("this is my results: ", results)
      //this will create our articles in the database by passing through our object array stored in the results variable
      db.Article.create(results)
        .then(function(dbArticle) {
          console.log("seingif past database load");
          return res.status(200);
        })
        .catch(function(err) {
          console.log("this is catch ");
          return res.status(304).json({ err });
        });
    });
  });

  app.put("/api/articles/:id", (req, res) => {
    db.Article.findOneAndUpdate(
      {
        _id: req.params.id
      },
      { $set: { saved: true } },
      {
        new: true
      }
    )
      .then(response => res.json(response))
      .catch(err => console.log(err));
  });

  app.delete("/api/clearall", (req, res) => {
    db.Article.remove({}, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
        res.json(response);
      }
    });
  });

  app.get("/api/saved", (req, res) => {
    db.Article.find({
      saved: true
    })
      .then(response => res.json(response))
      .catch(err => console.log("err with getting saved aricles: ", err));
  });
};
