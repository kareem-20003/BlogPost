import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import UserBlogsPage from './pages/UserBlogsPage';
import BlogForm from './components/BlogForm';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="container mx-auto px-4">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<HomePage />} />
        <Route path="/blogs/:blogId" element={<BlogDetailsPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/blogs/me" element={<UserBlogsPage />} />
          <Route path="/blogs/create" element={<BlogForm type="create" />} />
          <Route
            path="/blogs/edit/:blogId"
            element={<BlogForm type="edit" />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
