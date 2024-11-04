import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Avatar, Box, Typography, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const userToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (userToken) {
        try {
            const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
            setUsername(decodedToken.currentUserName);
            setEmail(decodedToken.currentUserEmailId); // Ensure this is correct
            setProfileImagePreview(`http://localhost:8080/profile-image/${decodedToken.currentUserImage}`);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
}, [userToken]);

useEffect(() => {
    // This useEffect will run when isUpdated changes
    if (isUpdated) {
      // Optionally, you can fetch the latest profile image if you have a method to get it
      // For now, we are assuming the new image is set in the form submission
      alert("Profile image updated successfully!");
      setIsUpdated(false); // Reset the state
      navigate('/Home'); // Navigate to home or any other action after update
    }
  }, [isUpdated, navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    // Check if the file size exceeds the limit (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }
  
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('emailId', email); // Add this line
    if (profileImage) {
        formData.append('file', profileImage); // Change this line
    }

    try {
        const response = await axios.post('http://localhost:8080/user-api/upload-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userToken}`,
            },
        });
        
        // Assuming response.data is the new image URL
        setIsUpdated(true);
        setProfileImagePreview(response.data); // Update the preview with new image URL
        alert("Profile uploaded successfully");
        navigate('/Home'); // Navigate or take any other action you need
    } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        alert('Error updating profile. Please try again later.');
    } finally {
        setIsSubmitting(false);
    }
};


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%', maxWidth: 400 }}>
        {/* Profile Image */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={profileImagePreview} alt={username} sx={{ width: 80, height: 80, mr: 2 }} />
          <label htmlFor="profile-image-upload">
            <input
              accept="image/*"
              id="profile-image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </Box>
    </Box>
  );
}
