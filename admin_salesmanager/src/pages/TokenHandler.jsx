import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TokenHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Extract token from query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token in localStorage for use elsewhere
      localStorage.setItem('accessToken', token);

      // Optionally, remove it from the URL by updating the browser history
      const currentUrl = new URL(window.location);
      currentUrl.searchParams.delete('token');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [location]);

  return null; // This component doesn't need to render anything
};

export default TokenHandler;
