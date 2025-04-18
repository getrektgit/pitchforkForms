import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const UserProfile = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    profile_pic: '',
  });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/userbyid/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('Fetched user data:', response.data);
        

        setUserData(response.data);
        setFormData({
          email: response.data.email,
          username: response.data.username,
          profile_pic: response.data.profile_pic || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Hiba az adatok lekérésekor:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, accessToken]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/user/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Profile updated successfully:', response.data);
      

      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Hiba a profil frissítésekor:', error);
    }
  };


  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!userData) {
    return <p>No user data found.</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Profile Picture URL:</label>
            <input
              type="text"
              name="profile_pic"
              value={formData.profile_pic}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2>Profile Details</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Profile Picture:</strong></p>
          <img src={userData.profile_pic} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <br />
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;