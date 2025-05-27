import React, { useState, useEffect } from 'react';

const Dependent_API_Call = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError(null);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch posts when selectedUserId changes
  useEffect(() => {
    if (selectedUserId === null) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      setLoadingPosts(true);
      setError(null);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`
        );
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [selectedUserId]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User List</h2>
      {loadingUsers && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            style={{
              cursor: 'pointer',
              fontWeight: user.id === selectedUserId ? 'bold' : 'normal',
              marginBottom: '0.5rem',
            }}
          >
            {user.name}
          </li>
        ))}
      </ul>

      <h3>User Posts</h3>
      {loadingPosts && <p>Loading posts...</p>}
      {!loadingPosts && posts.length === 0 && selectedUserId !== null && <p>No posts found.</p>}
      <ul>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: '1rem' }}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dependent_API_Call;
