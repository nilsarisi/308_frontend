import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Login = () => {
  const location = useLocation();
  const { login } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, password } = formData;

    try {
      const response = await login(email, password);
      if (response.success) {
        setSuccess('Login successful!');
        
        const userRole = response.user.role;
        
        // Assuming `response.user` contains `id`, `role`, and possibly `accessToken`
        // If `login` returns the token as `response.user.accessToken` (or response.accessToken),
        // use that. Otherwise, adjust based on how your `login` function returns data.
        const accessToken = response.user.accessToken;
        
        if (userRole === 'sales_manager') {
          // Pass the token in the URL (not recommended in production)
          window.location.href = `http://localhost:5174?token=${encodeURIComponent(accessToken)}`;
        } else if (userRole === 'product_manager') {
          window.location.href = `http://localhost:5175?token=${encodeURIComponent(accessToken)}`;
        } else {
          if (location.state?.from === '/cart') {
            navigate('/cart');
          } 
          else {
            navigate('/');
          }
        }
      } else {
        setError(response.error || 'Error during login');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/src/assets/background.png')] bg-cover bg-center">
      <div className="w-96 max-w-96 p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="font-karla text-5xl text-center font-bold text-green-900">
          Login
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-karla block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="font-karla block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-2 text-white bg-green-900 rounded-md font-medium"
          >
            Login
          </button>
        </form>
        <div className="text-center font-karla">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
