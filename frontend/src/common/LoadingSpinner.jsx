import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import './LoadingSpinner.css'; 

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <Spinner 
        animation="border" 
        role="status" 
        variant="primary" 
        style={{ width: '100px', height: '100px' }} 
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default LoadingSpinner;
