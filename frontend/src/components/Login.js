import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/posts';
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Login</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <button type="submit" style={{ width: '100%', padding: 8 }}>Login</button>
      <div style={{ marginTop: 10 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </form>
  );
}

export default Login;