import React, { useEffect, useState, useCallback } from 'react';

// Loader Component
const Loader = () => <p>Loading data...</p>;

// Error Component
const ErrorMessage = ({ message }) => <p style={{ color: 'red' }}>Error: {message}</p>;

// Post List Component
const PostList = ({ posts }) => (
  <ul>
    {posts.map(post => (
      <li key={post.id}>
        <strong>{post.title}</strong>
        <p>{post.body}</p>
      </li>
    ))}
  </ul>
);

const Fetch_Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setData(result.slice(0, 10));
    } catch (err) {
      setError(err.message || 'Unexpected Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Fetched Posts</h2>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <PostList posts={data} />}
    </div>
  );
};

export default Fetch_Data;