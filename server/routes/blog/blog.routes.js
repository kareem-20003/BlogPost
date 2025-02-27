// Base
const app = require('express').Router();
const controller = require('../../controller/blog.controller');

// Authentication Base
const { verifyToken } = require('../../utils/token.utils');

// Methods

// get
app.get('/', controller.getAllBlogs);
app.get('/getAllBlogs', controller.getAllBlogs);
app.get('/getBlogById/:id', controller.getBlogById);
app.get('/getBlogByTitle/:title', controller.getBlogByTitle);
app.get('/getAllBlogsPaginated', controller.getAllBlogsPaginated);
app.get('/getUserBlogs/:id', controller.getUserBlogs);
app.get('/me', verifyToken(), controller.getMyBlogs);

// post
app.post('/addBlog', verifyToken(), controller.addBlog);
app.put('/updateBlog/:id', controller.updateBlog);
app.delete('/deleteBlog/:userId/:blogId', verifyToken(), controller.deleteBlog);

// Exports
module.exports = app;
