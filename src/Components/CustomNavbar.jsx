import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaMicrochip,
  FaPhoneAlt,
  FaWhatsapp,
  FaHeadset
} from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import '../assets/Css/Navbar.css';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const { cart, categories } = useSelector((state) => state.products);
  const { user, admin } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read stored settings if available
  const savedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('techno_matrix_settings') || '{}');
    } catch {
      return {};
    }
  })();

  // Total items count in cart
  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="modern-tech-header sticky-top">
        {/* Top Mini Hotline & Announcement Strip */}
        {savedSettings.announcementActive !== false && (
          <div className="py-1 px-3 px-lg-5 text-white-50 small border-bottom border-dark border-opacity-25 d-flex justify-content-between align-items-center" style={{ fontSize: '0.74rem', background: 'rgba(0,0,0,0.3)' }}>
            <div className="d-flex align-items-center gap-2 text-truncate">
              <span className="badge bg-primary text-uppercase px-2" style={{ fontSize: '0.62rem' }}>ANNOUNCEMENT</span>
              <span className="text-light text-truncate">
                {savedSettings.announcementBar || '⚡ Enterprise Hardware & Cloud Attendance ERP Solutions with 1-Year On-site Warranty.'}
              </span>
            </div>
            <div className="d-none d-md-flex align-items-center gap-3 flex-shrink-0">
              <a
                href={`https://wa.me/91${savedSettings.whatsappHotline || '9861012345'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-50 text-decoration-none d-flex align-items-center gap-1 hover-light"
              >
                <FaWhatsapp className="text-success" size={12} />
                <span>B2B Hotline: +91 {savedSettings.whatsappHotline || '9861012345'}</span>
              </a>
              <span className="text-secondary">|</span>
              <span className="text-white-50">GST Invoices Available</span>
            </div>
          </div>
        )}

        {/* Main Tech Navigation Bar */}
        <div className="container-fluid px-lg-5 py-2">
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Logo */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-link text-white d-lg-none p-0 me-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
              <Link to="/" className="tech-brand-container">
                <span className="tech-logo-icon">
                  <FaMicrochip size={20} />
                </span>
                <div className="d-flex flex-column">
                  <span className="tech-brand-title">
                    TECHNO <span>MATRIX</span>
                  </span>
                  <span className="tech-brand-sub">HARDWARE & CLOUD SUITE</span>
                </div>
              </Link>
            </div>

            {/* Tech Search Bar */}
            <form onSubmit={handleSearch} className="flex-grow-1 tech-search-wrapper mx-2 mx-lg-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control tech-search-input"
                  placeholder="Search Biometric Thumb Machines, Face Terminals, Printers, CCTV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn tech-search-btn" type="submit" aria-label="Search">
                  <FaSearch size={14} />
                </button>
              </div>
            </form>

            {/* Right Action Icons */}
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              {/* Account / Profile Button */}
              <button
                type="button"
                className="tech-nav-action d-flex align-items-center gap-2 border-0"
                onClick={() => setShowProfileModal(true)}
                title="Account & Addresses"
              >
                <div className="position-relative">
                  {user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="rounded-circle"
                      style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                    />
                  ) : (
                    <FaUserCircle size={22} className="text-info" />
                  )}
                </div>
                <div className="d-none d-md-flex flex-column text-start">
                  <span className="small text-white-50" style={{ fontSize: '0.7rem' }}>
                    {user ? `Hi, ${user.name.split(' ')[0]}` : 'Client Account'}
                  </span>
                  <span className="fw-bold text-white small">Profile & Addresses</span>
                </div>
              </button>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="tech-nav-action d-flex align-items-center gap-2"
              >
                <div className="position-relative">
                  <FaShoppingCart size={18} className="text-light" />
                  {totalCartCount > 0 && (
                    <span className="tech-badge-cart position-absolute top-0 start-100 translate-middle badge rounded-pill fw-bold">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="fw-bold text-white small d-none d-md-inline">Cart</span>
              </Link>

              {/* Enterprise Admin Portal Shortcut */}
              <Link
                to={admin ? '/admin/dashboard' : '/admin/login'}
                className="tech-admin-btn d-flex align-items-center gap-2 small"
                title="Open Enterprise Admin Console"
              >
                <FaShieldAlt size={13} />
                <span className="d-none d-sm-inline">{admin ? 'Admin Console' : 'Admin Login'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Category Sub-bar (Clean Pill Navigation) */}
        <div className="tech-category-subnav py-2">
          <div className="container-fluid px-lg-5">
            <div className="d-flex align-items-center gap-2 overflow-x-auto tech-cat-scroll py-1">
              <Link to="/" className="tech-cat-pill text-nowrap">
                ⚡ All Hardware Solutions
              </Link>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.category_id}
                    to={`/category/${cat.slug || cat.category_id}`}
                    className="tech-cat-pill text-nowrap"
                  >
                    {cat.category_name}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/category/printers" className="tech-cat-pill text-nowrap">
                    All-in-One Printers
                  </Link>
                  <Link to="/category/biometric-attendance" className="tech-cat-pill text-nowrap">
                    Biometric Attendance
                  </Link>
                  <Link to="/category/face-attendance" className="tech-cat-pill text-nowrap">
                    Face Recognition Terminals
                  </Link>
                  <Link to="/category/cctv-cameras" className="tech-cat-pill text-nowrap">
                    CCTV Security Systems
                  </Link>
                  <Link to="/category/barcode-scanners-pos" className="tech-cat-pill text-nowrap">
                    POS Scanners & Thermal Printers
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Step-by-Step Profile Modal */}
      <ProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />
    </>
  );
};

export default CustomNavbar;
