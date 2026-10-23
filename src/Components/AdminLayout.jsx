import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTachometerAlt,
  FaTags,
  FaBoxOpen,
  FaShoppingBag,
  FaBullhorn,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaStore,
  FaUsers,
  FaUserTie,
  FaCog,
  FaMicrochip
} from 'react-icons/fa';
import '../assets/Css/Admin.css';

const AdminLayout = ({ children, pageTitle = 'Dashboard' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.user);

  // Mobile sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'ADMIN_LOGOUT' });
    navigate('/admin/login');
  };

  const navLinks = [
    {
      group: 'COMMAND CENTER',
      items: [
        { to: '/admin/dashboard', label: 'Executive Dashboard', icon: <FaTachometerAlt size={14} /> }
      ]
    },
    {
      group: 'HARDWARE & CATALOG',
      items: [
        { to: '/admin/categories', label: 'Device Categories', icon: <FaTags size={14} /> },
        { to: '/admin/products', label: 'Products & Smart Pricing', icon: <FaBoxOpen size={14} /> }
      ]
    },
    {
      group: 'B2B CLIENTS & CRM',
      items: [
        { to: '/admin/customers', label: 'Client & Customer Directory', icon: <FaUsers size={14} /> },
        { to: '/admin/leads', label: 'Leads & Inquiries CRM', icon: <FaUserTie size={14} /> }
      ]
    },
    {
      group: 'ORDERS & CAMPAIGNS',
      items: [
        { to: '/admin/orders', label: 'Customer Orders', icon: <FaShoppingBag size={14} /> },
        { to: '/admin/advertisements', label: 'Ad Banners & Campaigns', icon: <FaBullhorn size={14} /> }
      ]
    },
    {
      group: 'ENTERPRISE SYSTEM',
      items: [
        { to: '/admin/settings', label: 'Store, GST & Hotline Setup', icon: <FaCog size={14} /> }
      ]
    }
  ];

  return (
    <div className="admin-app-wrapper">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION (Tech Slate & Electric Indigo Theme)  */}
      {/* ======================================================== */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Brand Header */}
        <div className="sidebar-brand-box d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary-subtle">
          <Link to="/admin/dashboard" className="text-decoration-none d-flex align-items-center gap-2">
            <span className="sidebar-logo-icon rounded-3 p-2 text-white shadow-sm d-flex align-items-center justify-content-center">
              <FaMicrochip size={18} />
            </span>
            <div className="d-flex flex-column">
              <span className="sidebar-brand-text fw-bold text-white mb-0" style={{ letterSpacing: '0.5px' }}>
                TECHNO MATRIX
              </span>
              <span className="sidebar-badge-admin small">IT & HARDWARE SUITE</span>
            </div>
          </Link>
          <button
            className="btn btn-sm btn-link text-white-50 d-lg-none p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="sidebar-nav-container flex-grow-1 py-3 px-2">
          {navLinks.map((section, sIdx) => (
            <div key={sIdx} className="sidebar-group mb-3">
              <span className="sidebar-group-title text-uppercase px-3 small fw-bold">
                {section.group}
              </span>
              <ul className="list-unstyled mt-2 d-flex flex-column gap-1 mb-0">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        <span className="sidebar-link-icon d-flex align-items-center justify-content-center">
                          {item.icon}
                        </span>
                        <span className="sidebar-link-text">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick External Store Link */}
        <div className="p-3 border-top border-secondary-subtle">
          <Link
            to="/"
            target="_blank"
            className="btn btn-sm btn-outline-info w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
          >
            <FaExternalLinkAlt size={12} />
            <span>View Public Storefront</span>
          </Link>
        </div>

        {/* Sidebar Admin User Footer */}
        <div className="sidebar-user-footer p-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <span className="admin-avatar-pill rounded-circle fw-bold d-flex align-items-center justify-content-center">
                TM
              </span>
              <span className="admin-status-dot position-absolute bottom-0 end-0 rounded-circle bg-success"></span>
            </div>
            <div className="d-flex flex-column text-start">
              <span className="text-white small fw-bold">Lead Administrator</span>
              <span className="text-white-50" style={{ fontSize: '0.7rem' }}>admin@technomatrix.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-link text-danger p-1"
            title="Sign Out"
          >
            <FaSignOutAlt size={15} />
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN ADMIN WORKSPACE (Top Header + Page Content)         */}
      {/* ======================================================== */}
      <div className="admin-main-viewport">
        {/* Top Header */}
        <header className="admin-top-header bg-white border-bottom shadow-xs py-2 px-3 px-lg-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {/* Mobile Toggle Button */}
            <button
              className="btn btn-sm btn-outline-secondary d-lg-none p-1 px-2 rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation"
            >
              <FaBars size={18} />
            </button>

            {/* Page Title & Breadcrumbs */}
            <div>
              <h5 className="fw-bold text-dark mb-0">{pageTitle}</h5>
              <span className="text-muted small">TECHNO MATRIX Enterprise Hardware Ecosystem</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/"
              className="btn btn-outline-primary btn-sm d-none d-sm-inline-flex align-items-center gap-1 rounded-pill px-3"
            >
              <FaStore size={12} /> Live Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
            >
              <FaSignOutAlt size={12} /> Logout
            </button>
          </div>
        </header>

        {/* Content Body Area: SCROLLS VERTICALLY & HORIZONTALLY INDEPENDENTLY */}
        <main className="admin-page-content p-3 p-lg-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
