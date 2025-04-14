// src/components/GoogleLoginButton.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    // The response contains the Google token
    const tokenId = response.credential;

    // Send the token to your backend for validation
    fetch('http://localhost:5000/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: tokenId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { id, name, email } = data.user;

        console.log('User authenticated:', data);


        // Save user details to localStorage for persistence
        localStorage.setItem('id', id);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);

        localStorage.removeItem('cart');
        // Navigate to home screen
        navigate('/home');
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default GoogleLoginButton;
