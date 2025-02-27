import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Blog } from '../types';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';

const UserBlogsPage = () => {
  const { user } = useAuth();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        // Adjust the API response handling
        const { data } = await axios.get<{ userBlogs: Blog[] }>(`/blogs/me`);
        console.log('🚀 ~ fetchUserBlogs ~ data:', data);
        setUserBlogs(data.userBlogs || []);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
        setUserBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user?._id]);

  if (loading) {
    return <div className="text-center mt-8">Loading your blogs...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <Link
          to="/blogs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create New Blog
        </Link>
      </div>

      {userBlogs.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-xl mb-4">You haven't created any blogs yet.</p>
          <Link
            to="/blogs/create"
            className="text-blue-600 hover:underline transition-colors"
          >
            Start writing your first blog →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogsPage;
