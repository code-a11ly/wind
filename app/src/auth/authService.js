import { jwtDecode } from 'jwt-decode';
import { getIp } from '../components/ip.js';

export const handleLogin = async () => {
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, refreshToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('User logged in');
  } else {
    console.error('Login failed');
  }
};

export const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('User logged out');
};




const CheckAuth = async () => {


  const ip = getIp();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  
  if (!accessToken && !refreshToken) return null;

  // Check if access token is valid
  try {
    const decoded = jwtDecode(accessToken);
    if (decoded.exp * 1000 > Date.now()) return decoded; // Token valid
  } catch {
    console.log('Access token expired, attempting to refresh...');
  }

  // Refresh the access token
  try {
    const response = await fetch(`http://${ip}:5000/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      return jwtDecode(accessToken); // Return updated user data
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return null; // Tokens are invalid
};

export default CheckAuth;
