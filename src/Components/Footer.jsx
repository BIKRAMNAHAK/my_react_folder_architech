import React from 'react';
import { Link } from 'react-router';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaShieldAlt, FaMicrochip } from 'react-icons/fa';

const Footer = () => {
  const savedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('techno_matrix_settings') || '{}');
    } catch {
      return {};
    }
  })();
  const hotline = savedSettings.whatsappHotline || '9861012345';
  const email = savedSettings.supportEmail || 'support@technomatrix.com';
  const address = savedSettings.serviceAddress || 'Saheed Nagar, Bhubaneswar, Odisha - 751007';

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5 border-top border-secondary border-opacity-25" style={{ background: '#090d16' }}>
      <div className="container">
        <div className="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
          {/* About Company */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="p-2 bg-primary rounded-3 text-white d-flex align-items-center justify-content-center">
                <FaMicrochip size={18} />
              </span>
              <h5 className="fw-bold text-white mb-0" style={{ letterSpacing: '0.5px' }}>
                TECHNO MATRIX
              </h5>
            </div>
            <p className="text-white-50 small mb-3">
              Leading enterprise provider of industrial IT hardware and cloud attendance ERP systems.
              Equipping schools, warehouses, healthcare facilities, and offices with certified
              Biometric Thumb Machines, AI Face Recognition, Heavy-Duty Printers, CCTV Security, and POS hardware.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary px-3 py-2">ISO 9001 Certified</span>
              <span className="badge bg-success px-3 py-2">GST Compliant</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Hardware Suite</h6>
            <ul className="list-unstyled small text-white-50 d-flex flex-column gap-2 mb-0">
              <li><Link to="/category/printers" className="text-white-50 text-decoration-none hover-light">Heavy-Duty Printers</Link></li>
              <li><Link to="/category/biometric-attendance" className="text-white-50 text-decoration-none hover-light">Biometric Thumb Devices</Link></li>
              <li><Link to="/category/face-attendance" className="text-white-50 text-decoration-none hover-light">Face Recognition Terminals</Link></li>
              <li><Link to="/category/cctv-cameras" className="text-white-50 text-decoration-none hover-light">4K CCTV Security & NVR</Link></li>
              <li><Link to="/category/barcode-scanners-pos" className="text-white-50 text-decoration-none hover-light">POS Thermal & Scanners</Link></li>
            </ul>
          </div>

          {/* Client Software Advertisements & Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Client Portals & Deals</h6>
            <ul className="list-unstyled small text-white-50 d-flex flex-column gap-2 mb-0">
              <li><Link to="/offer/1" className="text-info text-decoration-none fw-semibold">★ Special Corporate Package</Link></li>
              <li><Link to="/cart" className="text-white-50 text-decoration-none hover-light">Shopping Cart</Link></li>
              <li><Link to="/checkout" className="text-white-50 text-decoration-none hover-light">Instant B2B Checkout</Link></li>
              <li><Link to="/admin/login" className="text-white-50 text-decoration-none hover-light"><FaShieldAlt className="me-1 text-primary"/> Enterprise Admin Console</Link></li>
            </ul>
          </div>

          {/* Help & WhatsApp Enquiry */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Support & Inquiries</h6>
            <p className="text-white-50 small mb-2 d-flex align-items-center gap-2">
              <FaPhoneAlt className="text-primary" /> +91 {hotline}
            </p>
            <p className="text-white-50 small mb-2 d-flex align-items-center gap-2">
              <FaEnvelope className="text-primary" /> {email}
            </p>
            <p className="text-white-50 small mb-3 d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> {address}
            </p>
            <a
              href={`https://wa.me/91${hotline}?text=Hello%20TECHNO%20MATRIX%2C%20I%20want%20to%20enquire%20about%20hardware%20and%20software%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold rounded-pill"
            >
              <FaWhatsapp size={16} /> WhatsApp Hotline
            </a>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 small text-white-50">
          <p className="mb-0">© {new Date().getFullYear()} TECHNO MATRIX Enterprise Systems. All rights reserved.</p>
          <p className="mb-0">Enterprise IT Hardware & Integrated Software Solutions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
