// Base
const Blog = require('../model/blog/blog.model');
const User = require('../model/user/user.model');

// Functions
const getAllBlogs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const fieldPrefixMatch = search.match(
        /^(title|author|tags|content):\s*(.*)/i
      );
      if (fieldPrefixMatch) {
        const field = fieldPrefixMatch[1].toLowerCase();
        const term = fieldPrefixMatch[2].trim();

        if (field === 'title') {
          query = { title: { $regex: term, $options: 'i' } };
        } else if (field === 'author') {
          // Find users with matching firstName or lastName
          const matchingUsers = await User.find({
            $or: [
              { firstName: { $regex: term, $options: 'i' } },
              { lastName: { $regex: term, $options: 'i' } },
            ],
          });
          const userIds = matchingUsers.map((user) => user._id);
          query = { author: { $in: userIds } };
        } else if (field === 'tags') {
          query = { tags: { $regex: term, $options: 'i' } };
        } else if (field === 'content') {
          query = { content: { $regex: term, $options: 'i' } };
        }
      } else {
        const matchingUsers = await User.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
          ],
        });
        const userIds = matchingUsers.map((user) => user._id);
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { author: { $in: userIds } },
          ],
        };
      }
    }

    const blogs = await Blog.find(query)
      .populate('author')
      .sort({ createdAt: -1 });

    console.log('🚀 ~ getAllBlogs ~ blogs:', blogs);
    res.status(200).json({ allBlogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBlogById = async (req, res) => {
  let { id: _id } = req.params;
  let blog = await Blog.findById(_id).populate('author');
  res.status(200).json({ msg: 'success', blog });
};

const getBlogByTitle = async (req, res) => {
  let { title } = req.params;
  let blog = await Blog.findOne({ title });
  res.status(200).json({ msg: 'success', blog });
};

const getAllBlogsPaginated = async (req, res) => {
  let { page, size } = req.query;
  numOfItems = parseInt(size);
  skippedItems = (+page - 1) * numOfItems;
  let blogs = await Blog.find({}).limit(numOfItems).skip(skippedItems);
  res.status(200).json({ msg: 'success', blogs });
};

const getUserBlogs = async (req, res) => {
  let { id: _id } = req.params;
  let { userBlogs } = await User.findById(_id).populate('userBlogs');
  res.status(200).json({ msg: 'success', userBlogs });
};

const getMyBlogs = async (req, res) => {
  console.log('HERE');
  let { userBlogs } = await User.findById(req.user._id).populate('userBlogs');
  res.status(200).json({ msg: 'success', userBlogs });
};

// POST|PUT|Delete Req Methods
const addBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!req.headers.authorization) {
      return res.status(401).json({ msg: 'Authorization token required' });
    }

    const newBlog = new Blog({
      title,
      content,
      tags,
      author: req.user._id,
    });

    const [savedBlog, updatedUser] = await Promise.all([
      newBlog.save(),
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { userBlogs: newBlog._id } },
        { new: true }
      ),
    ]);

    res.status(201).json({
      msg: 'Blog created successfully',
      data: savedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  let { id: _id } = req.params;
  let { title, content } = req.body;
  await Blog.findByIdAndUpdate(_id, { title, content });
  res.status(200).json({ msg: 'updated' });
};

const deleteBlog = async (req, res) => {
  let { blogId, userId } = req.params;
  await Blog.findByIdAndDelete({ _id: blogId });
  await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { userBlogs: blogId } }
  );
  res.status(200).json({ msg: 'deleted' });
};

// Exports
module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogByTitle,
  addBlog,
  updateBlog,
  getMyBlogs,
  deleteBlog,
  getAllBlogsPaginated,
  getUserBlogs,
};
