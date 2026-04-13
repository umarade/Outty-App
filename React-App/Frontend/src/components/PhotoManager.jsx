import React, { useState } from 'react';

function PhotoManager() {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = () => {
    setError('');

    // simulate file
    const simulatedFile = {
      type: 'image/jpeg',
      size: 500000,
      url: 'https://via.placeholder.com/150',
    };

    if (!simulatedFile) {
      setError('No file selected.');
      return;
    }

    if (!simulatedFile.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.');
      return;
    }

    if (simulatedFile.size > 2000000) {
      setError('File is too large.');
      return;
    }

    setPhoto(simulatedFile.url);
  };

  const handleDelete = () => {
    if (!photo) {
      setError('No photo to delete.');
      return;
    }

    setError('');
    setPhoto(null);
  };

  return (
    <div>
      <h2>Photo Manager</h2>

      {error && <p>{error}</p>}

      {photo ? (
        <img src={photo} alt="uploaded" width="150" />
      ) : (
        <p>No photo uploaded</p>
      )}

      <button onClick={handleUpload}>Upload Photo</button>
      <button onClick={handleDelete}>Delete Photo</button>
    </div>
  );
}

export default PhotoManager;