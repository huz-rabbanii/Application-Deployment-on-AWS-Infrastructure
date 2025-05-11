import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ marginBottom: 20 }}>
      <Link to="/posts" style={{ marginRight: 10 }}>Posts</Link>
      <Link to="/create-post" style={{ marginRight: 10 }}>Create Post</Link>
      {!token && (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
          <Link to="/register" style={{ marginRight: 10 }}>Register</Link>
        </>
      )}
      {token && (
        <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
      )}
    </nav>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>Welcome to the Blog App</h2>
      <Link to="/login"><button style={{ margin: 10 }}>Login</button></Link>
      <Link to="/register"><button style={{ margin: 10 }}>Register</button></Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <h1 style={{ textAlign: 'center' }}>Blog App</h1>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;