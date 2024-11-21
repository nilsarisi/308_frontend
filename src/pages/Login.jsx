import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../contexts/CartContext'; // Import CartContext to access login and signup functions

const LoginSignup = () => {
  const { login, signup } = useCart(); // Access login and signup functions from context
  const navigate = useNavigate(); // Initialize useNavigate
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword, address } = formData;

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      if (isLogin) {
        // Login flow
        const response = await login(email, password);
        if (response.success) {
          setSuccess('Login successful!');
          navigate('/'); // Redirect to home page
        } else {
          setError(response.error || 'Error during login');
        }
      } else {
        // Signup flow
        const response = await signup(name, email, password, address);
        if (response.success) {
          setSuccess('Signup successful! Please log in.');
          setIsLogin(true); // Switch to login after successful signup
        } else {
          setError(response.error || 'Error during signup');
        }
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
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="font-karla block mb-1 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}
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
          {!isLogin && (
            <>
              <div>
                <label className="font-karla block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="font-karla block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full px-6 py-2 text-white bg-green-900 rounded-md font-medium"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center font-karla">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Reset error on toggle
                setSuccess(''); // Reset success on toggle
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
