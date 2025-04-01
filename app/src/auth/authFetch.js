const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    console.log('Access token expired, refreshing...');
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const { accessToken } = await refreshResponse.json();
      localStorage.setItem('accessToken', accessToken);
      headers.Authorization = `Bearer ${accessToken}`;
      return fetch(url, { ...options, headers });
    }
  }

  return response;
};
