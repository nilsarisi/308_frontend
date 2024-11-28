import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useCart } from '../contexts/CartContext'; // Login function from context

const Login = () => {
  const { login } = useCart();
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // Error message state

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages

    const { email, password } = formData;

    try {
      const response = await login(email, password);
      if (response.success) {
        // Successful login: Navigate to the home page
        navigate('/');
      } else {
        // Display error message if login fails
        const errorMessage =
          typeof response.error === 'string'
            ? response.error
            : 'Invalid email or password.';
        setError(errorMessage);
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

        {/* Display error message */}
        {error && <p className="text-red-600 text-center">{error}</p>}

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
