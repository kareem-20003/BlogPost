const mongoose = require("mongoose");

const auditSchema = mongoose.Schema({
  auditAction: {
    type: String,
    required: true,
    enum: [
      "getAllBlogs",
      "getBlogByID",
      "getUserBlogs",
      "addBlog",
      "updateBlog",
      "getAllUsers",
      "register",
      "login",
    ],
  },
  auditData: Object,
  auditStatus: Number,
  errorMessage: Object,
  auditBy: String,
  auditOn: Date,
});

module.exports = mongoose.model("Audit", auditSchema);
