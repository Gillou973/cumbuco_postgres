// src/api.js
const API_URL = 'http://localhost:3000/api/users';

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return await res.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};
