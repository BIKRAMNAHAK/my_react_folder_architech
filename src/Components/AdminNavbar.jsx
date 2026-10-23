import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTachometerAlt,
  FaTags,
  FaBoxOpen,
  FaShoppingBag,
  FaBullhorn,
  FaSignOutAlt,
  FaStore
} from 'react-icons/fa';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch({ type: 'ADMIN_LOGOUT' });
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/categories', label: 'Categories (Home Sections)', icon: <FaTags /> },
    { to: '/admin/products', label: 'Add / Manage Products', icon: <FaBoxOpen /> },
    { to: '/admin/orders', label: 'Orders & Referrals', icon: <FaShoppingBag /> },
    { to: '/admin/advertisements', label: 'Client Ad Campaigns', icon: <FaBullhorn /> }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-3 py-2 sticky-top shadow-sm">
      <div className="container-fluid">
        <Link to="/admin/dashboard" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark px-2 py-1">ADMIN</span>
          <span>e-Shoping Manager</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to} className="nav-item">
                  <Link
                    to={item.to}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                      isActive ? 'active bg-primary text-white fw-bold' : 'text-light'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-info btn-sm d-flex align-items-center gap-1">
              <FaStore /> View Live Store
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
