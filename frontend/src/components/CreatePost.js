import React, { useState } from 'react';
import axios from 'axios';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let imageKey = null;

    if (file) {
      const { data } = await axios.get('http://localhost:8080/api/generate-upload-url', {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(data.url, file, {
        headers: { 'Content-Type': 'image/jpeg' },
      });
      imageKey = data.key;
    }

    await axios.post('http://localhost:8080/api/posts', { title, content, imageKey }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.href = '/posts';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;