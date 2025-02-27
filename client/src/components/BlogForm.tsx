import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Blog } from '../types';

interface BlogFormProps {
  type: 'create' | 'edit';
}

interface FormData {
  title: string;
  content: string;
  tags: string[];
}

export default function BlogForm({ type }: BlogFormProps) {
  const { blogId } = useParams<{ blogId?: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: [],
  });

  useEffect(() => {
    if (type === 'edit' && blogId) {
      const fetchBlog = async () => {
        try {
          const { data } = await axios.get<{ blog: Blog }>(
            `/blogs/getBlogById/${blogId}`
          );
          console.log('🚀 ~ fetchBlog ~ data:', data);
          setFormData({
            title: data.blog.title,
            content: data.blog.content,
            tags: data.blog.tags,
          });
        } catch (error) {
          console.error('Error fetching blog:', error);
        }
      };
      fetchBlog();
    }
  }, [blogId, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
    };

    try {
      if (type === 'create') {
        await axios.post(`/blogs/addBlog`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        if (!blogId) throw new Error('Missing blog ID');
        await axios.put(`/blogs/updateBlog/${blogId}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      navigate('/blogs/me');
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleCancel = () => {
    navigate('/blogs/me');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Content</label>
        <ReactQuill
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          theme="snow"
          className="mb-4"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value.split(',').map((tag) => tag.trim()),
            })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {type === 'create' ? 'Publish Blog' : 'Update Blog'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
