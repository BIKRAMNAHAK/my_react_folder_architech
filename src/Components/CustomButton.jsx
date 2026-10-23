import React from 'react';

const CustomButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  icon = null
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} d-inline-flex align-items-center justify-content-center gap-2 fw-semibold ${className}`}
      style={{ transition: 'all 0.2s ease', cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {icon && <span className="d-flex align-items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default CustomButton;
