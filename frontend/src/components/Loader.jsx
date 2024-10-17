// components/Loader.js
import React from 'react';
import '../styles/Loader.css'; // Add CSS styles for loader

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Analyzing your content...</p>
    </div>
  );
};

export default Loader;
