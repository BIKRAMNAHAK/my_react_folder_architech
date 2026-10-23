import React from 'react';

const CustomLoader = ({ text = 'Loading products and offers...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">{text}</p>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center py-4 gap-2 text-primary">
      <div className="spinner-border spinner-border-sm" role="status"></div>
      <span className="fw-semibold text-muted small">{text}</span>
    </div>
  );
};

export default CustomLoader;
