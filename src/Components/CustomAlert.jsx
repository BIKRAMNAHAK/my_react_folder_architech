import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const CustomAlert = ({ type = 'success', message = '', onClose = null }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error' || type === 'danger';

  const icon = isSuccess ? (
    <FaCheckCircle className="text-success fs-5 me-2" />
  ) : isError ? (
    <FaExclamationCircle className="text-danger fs-5 me-2" />
  ) : (
    <FaInfoCircle className="text-primary fs-5 me-2" />
  );

  const alertClass = isSuccess ? 'alert-success' : isError ? 'alert-danger' : 'alert-info';

  return (
    <div className={`alert ${alertClass} d-flex align-items-center justify-content-between shadow-sm py-2 px-3 rounded-3 mb-3 fade show`}>
      <div className="d-flex align-items-center">
        {icon}
        <span className="fw-medium small">{message}</span>
      </div>
      {onClose && (
        <button type="button" className="btn-close btn-sm ms-2" aria-label="Close" onClick={onClose}></button>
      )}
    </div>
  );
};

export default CustomAlert;
