import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="py-4 mb-8 border-b">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Blog Platform
        </Link>

        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/blogs/me" className="hover:text-blue-600">
                My Blogs
              </Link>
              <Link to="/blogs/create" className="hover:text-blue-600">
                Create Blog
              </Link>
              <button onClick={handleLogout} className="hover:text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/signup" className="hover:text-blue-600">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
