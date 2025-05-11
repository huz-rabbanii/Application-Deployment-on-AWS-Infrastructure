import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CreatePost({ post, isEdit }) {
  // If editing, initialize state with post data
  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const [file, setFile] = useState(null);
  const [imageKey, setImageKey] = useState(post ? post.imageKey : null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageKey(post.imageKey);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let uploadedImageKey = imageKey;

    if (file) {
      const { data } = await axios.get('http://localhost:8080/api/generate-upload-url', {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(data.url, file, {
        headers: { 'Content-Type': 'image/jpeg' },
      });
      uploadedImageKey = data.key;
    }

    if (isEdit && post && post.id) {
      // Update existing post
      await axios.put(
        `http://localhost:8080/api/posts/${post.id}`,
        { title, content, imageKey: uploadedImageKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      // Create new post
      await axios.post(
        'http://localhost:8080/api/posts',
        { title, content, imageKey: uploadedImageKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    window.location.href = '/posts';
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isEdit ? 'Edit Post' : 'Create Post'}</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" style={{ width: '100%', marginBottom: 10, padding: 8 }} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 10 }} />
      <button type="submit" style={{ width: '100%', padding: 8, marginBottom: 10 }}>{isEdit ? 'Update Post' : 'Create Post'}</button>
      <Link to="/posts"><button type="button" style={{ width: '100%', padding: 8 }}>Back to Posts</button></Link>
    </form>
  );
}

export default CreatePost;