const mongoose = require("mongoose");

let blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  photo: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  tags: [String]
});

let blogModel = mongoose.model("Blogs", blogSchema);

module.exports = blogModel;
