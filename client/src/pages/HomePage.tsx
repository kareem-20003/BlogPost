import { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import axios from '../utils/axios';
import { Blog } from '../types';

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get<{ allBlogs: Blog[] }>('/blogs', {
          params: {
            search: searchTerm,
            fields: 'title,tags,author',
          },
        });
        setBlogs(data.allBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title, tags, or author..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No blogs found matching your search
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
