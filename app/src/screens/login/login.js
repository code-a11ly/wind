

import React, { useState } from 'react';

import GoogleLoginButton from '../../components/googleLoginButton.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { setTempData, getTempData } from '../../components/tempData.js';
import { getIp } from '../../components/ip.js';


function LoginForm() {


  const ip = getIp();



  const [hasAccount, setHasAccount] = useState(true);

  const account = () => {
    if (hasAccount === true) {
      setHasAccount(false);
    } else {
      setHasAccount(true);
    }
  };

  const [dataToSend, setDataToSend] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [logData, setLogData] = useState({
    email: '',
    password: ''
  });



  if(hasAccount) {
    const handleInputChange = (key, value) => {
      setLogData({
        ...logData,
        [key]: value
      });
    };

    const authLog = async () => {
      try {
        const response = await fetch(`http://${ip}:5000/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logData),
        });

        if (response.status === 200) {
          console.log('Login successful');
          const data = await response.json();

          setTempData(data);
          // console.log('DATAtemp:', getTempData());
          // Handle successful login, such as storing tokens in local storage and redirecting to a dashboard
          // navigation.navigate('HomeScreen');
        } else if (response.status === 401) {
          console.error('Email ou Senha inválidos!');
          // Handle login failure, show error message to the user, etc.
        } else {
          console.error('Falha em fazer login!');
          // Handle login failure, show error message to the user, etc.
        }
      } catch (error) {
        console.error('Error logging in:', error);
        // Handle error (e.g., show error message to the user)
      }
    };



    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-100">
        <div className="w-96 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              authLog();
            }}
          >
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-normal text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                // placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={logData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-normal text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                // placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={logData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => authLog()}
            >
              Login
            </button>
          </form>

          <div className="flex items-center text-center my-5">
            <div className="flex-1 border-b border-gray-300 mx-2"></div>
            <span className="text-sm text-gray-600">OU</span>
            <div className="flex-1 border-b border-gray-300 mx-2"></div>
          </div>


          <GoogleOAuthProvider clientId={'1081901243443-i25mpt43godbvnqi244tqpdgs7msoe6h.apps.googleusercontent.com'}>
            <GoogleLoginButton />
          </GoogleOAuthProvider>


          {/* Additional Links */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" onClick={account} className="text-indigo-600 hover:underline" >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    );

  } else {


    const handleInputChange = (key, value) => {
      setDataToSend({
        ...dataToSend,
        [key]: value
      });

    };

    const registerUser = () => {
      console.log(dataToSend);
      fetch(`http://${ip}:5000/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          console.log('Data sent to server:', data);
          // Handle the response data from the server
          setTempData({ key: data });


        })
        .catch(error => {
          console.error('There was a problem with the request:', error);
          // Handle errors here
      });

      // navigation.navigate('HomeScreen');
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-100">
        <div className="w-96 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Sign Up</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser();
            }}
          >
            {/* Name Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-normal text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                // placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={dataToSend.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-normal text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                // placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={dataToSend.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-normal text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                // placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={dataToSend.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign up
            </button>
          </form>

          <div className="flex items-center text-center my-5">
            <div className="flex-1 border-b border-gray-300 mx-2"></div>
            <span className="text-sm text-gray-600">OU</span>
            <div className="flex-1 border-b border-gray-300 mx-2"></div>
          </div>


          <GoogleOAuthProvider clientId={'1081901243443-i25mpt43godbvnqi244tqpdgs7msoe6h.apps.googleusercontent.com'}>
            <GoogleLoginButton />
          </GoogleOAuthProvider>


          {/* Additional Links */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="#" onClick={account} className="text-indigo-600 hover:underline" >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
