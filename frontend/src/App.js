import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Router>
      <div>
        <h1>Blog App</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/" element={<p>Home Page - <a href="/login">Login</a></p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;