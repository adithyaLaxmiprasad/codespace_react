import React, { useEffect, useState } from 'react';

const Fetch_Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // for UX enhancement
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example public API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.slice(0, 10)); // limiting to first 10 items
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Fetched Posts</h2>
      <ul>
        {data.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fetch_Data;
