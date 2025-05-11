import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import { Link } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('http://localhost:8080/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(data);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/create-post"><button>Create New Post</button></Link>
      </div>
      {editingPost ? (
        <div>
          <CreatePost post={editingPost} isEdit={true} />
          <button onClick={handleCancelEdit} style={{ marginTop: 10 }}>Cancel</button>
        </div>
      ) : null}
      <h2>Posts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ border: '1px solid #ddd', borderRadius: 8, marginBottom: 20, padding: 16, background: '#fafafa' }}>
            <strong style={{ fontSize: 18 }}>{post.title}</strong>
            <p>{post.content}</p>
            {post.imageKey && (
              <img
                src={`https://samhuz-blog-uploads.s3.amazonaws.com/${post.imageKey}`}
                alt="Post"
                style={{ width: '100px', display: 'block', marginBottom: 10 }}
              />
            )}
            <button onClick={() => handleEdit(post)} style={{ marginRight: 10 }}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;