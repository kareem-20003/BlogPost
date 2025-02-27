import { Link, useLocation } from 'react-router-dom';
import { Blog } from '../types';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  let location = useLocation();

  const getAuthorName = () => {
    if (typeof blog.author === 'object' && blog.author) {
      return `${blog.author.firstName} ${blog.author.lastName}`;
    }
    return 'Unknown Author';
  };

  const getContentPreview = () => {
    // Remove HTML tags for preview
    const plainText = blog.content.replace(/<[^>]+>/g, '');
    const words = plainText.split(' ');
    const preview = words.slice(0, 20).join(' ');
    return words.length > 20 ? `${preview}...` : preview;
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>

      {!location.pathname.includes('/me') && (
        <p className="text-gray-600 mb-2">By {getAuthorName()}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-gray-700 mb-4 flex-grow">{getContentPreview()}</p>

      <Link
        to={`/blogs/${blog._id}`}
        className="text-blue-600 hover:text-blue-800 font-medium inline-block mt-auto"
      >
        Read More →
      </Link>
    </div>
  );
};

export default BlogCard;
