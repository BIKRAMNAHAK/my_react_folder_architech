import React from 'react';
import { useParams, Link } from 'react-router';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import { FaCheckCircle, FaShoppingBag, FaWhatsapp, FaHome } from 'react-icons/fa';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="order-success-page bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center" style={{ maxWidth: '600px' }}>
          <div className="mb-3">
            <FaCheckCircle size={72} className="text-success" />
          </div>

          <h2 className="fw-bold text-dark mb-2">Order Confirmed!</h2>
          <p className="lead text-secondary mb-3">
            Thank you for ordering with <strong>e-Shoping Solutions</strong>.
          </p>

          <div className="p-3 bg-light rounded-3 border mb-4">
            <span className="text-muted small text-uppercase fw-semibold d-block">Order Reference Number</span>
            <span className="fs-3 fw-bold text-primary">#{orderId || '1001'}</span>
            <p className="text-muted small mb-0 mt-2">
              We have dispatched your hardware order details for warehouse packing and software sync verification.
            </p>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/" className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-semibold">
              <FaHome /> Back to Homepage
            </Link>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello! I just placed order #${orderId || '1001'} on e-Shoping. Please confirm delivery timeline.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-semibold"
            >
              <FaWhatsapp /> Track on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
