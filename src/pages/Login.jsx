import React, { useState } from 'react';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the URL based on whether it's a login or signup request
    const url = `http://localhost:8080/${isLogin ? 'login' : 'signup'}`;
    const { name, email, password, confirmPassword, address } = formData;

    // Ensure passwords match for signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Prepare data to send to the backend
    const userData = isLogin
      ? { email, password }  // Login only needs email and password
      : { name, email, password, address }; // Signup requires name, email, password, and address

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(isLogin ? 'Login successful!' : 'Signup successful!');
        if (isLogin) {
          localStorage.setItem('token', data.token); // Save JWT for authentication
        }
      } else {
        setError(data.message || 'Error during authentication');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/src/assets/background.png')] bg-cover bg-center">
      <div className="w-96 max-w-96 p-8 space-y-6">
        <h2 className="font-karla text-5xl text-center font-bold text-green-900">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {error && <p className="text-red-600">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="font-karla mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-4 border rounded-md"
                required
              />
            </div>
          )}
          <div>
            <label className="font-karla block mb-1 text-sm font-medium text-gray-700">Email</label>
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
            <label className="font-karla mb-1 text-sm font-medium text-gray-700">Password</label>
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
                <label className="font-karla mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
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
                <label className="font-karla mb-1 text-sm font-medium text-gray-700">Address</label>
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
          <button type="submit" className="w-auto px-6 py-2 text-white bg-green-900 rounded-md mx-auto block">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="font-karla text-center">
          <p>
            {isLogin ? "Don't have an account?  " : 'Already have an account? '}
            <button
              type="button"
              className="font-karla text-blue-600 underline ml-auto"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Reset error on toggle
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
