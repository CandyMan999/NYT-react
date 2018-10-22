const mongoose = require("mongoose");

// Save a reference to the Schema constructor

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new mongoose.Schema({
  // `title` is required and of type String
  title: {
    type: String,
    unique: true
  },
  // `link` is required and of type String
  date: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  }
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
