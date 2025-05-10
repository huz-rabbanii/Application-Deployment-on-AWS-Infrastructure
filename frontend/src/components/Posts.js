import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      <a href="/create-post">Create Post</a>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.imageKey && <img src={`http://localhost:8080/api/signed-url/${post.imageKey}`} alt={post.title} />}
        </div>
      ))}
    </div>
  );
}

export default Posts;