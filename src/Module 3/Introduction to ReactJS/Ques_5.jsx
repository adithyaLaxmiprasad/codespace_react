import React from 'react';

const Profile = ({ name, age }) => {
  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

export default Profile;
