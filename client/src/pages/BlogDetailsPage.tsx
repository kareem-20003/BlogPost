// src/pages/BlogDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Blog, User } from '../types';
import DOMPurify from 'dompurify';

export default function BlogDetailsPage() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get<{ msg: string; blog: Blog }>(
          `/blogs/getBlogById/${blogId}`
        );
        console.log('🚀 ~ fetchBlog ~ data:', data.blog);
        setBlog(data.blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/blogs/deleteBlog/${user?._id}/${blogId}`);
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (!blog) return <div className="text-center mt-8">Loading...</div>;

  // Type guard to check if author is populated
  const isAuthorObject = (author: any): author is User =>
    typeof author !== 'string' && author !== null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {blog.photo && (
        <img
          src={blog.photo}
          alt={blog.title}
          className="w-full h-64 object-cover mb-6 rounded-lg"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <div className="flex items-center gap-4 mb-6">
        <p className="text-gray-600">
          By{' '}
          {isAuthorObject(blog.author)
            ? `${blog.author.firstName} ${blog.author.lastName}`
            : 'Unknown Author'}
        </p>
        <div className="flex gap-2">
          {blog.tags?.map((tag) => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="text-lg whitespace-pre-wrap mb-8"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
      />

      {user?._id ===
        (isAuthorObject(blog.author) ? blog.author._id : blog.author) && (
        <div className="mt-8 flex gap-4">
          <Link
            to={`/blogs/edit/${blog._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
