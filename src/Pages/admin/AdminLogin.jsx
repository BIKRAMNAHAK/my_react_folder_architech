import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { adminLoginApi } from '../../Services/Actions/postApis';
import CustomAlert from '../../Components/CustomAlert';
import CustomButton from '../../Components/CustomButton';
import { FaShieldAlt, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import '../../assets/Css/Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('admin@eshoping.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: 'error', msg: 'Please enter admin email and password' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'ADMIN_LOGIN');
    formdata.append('admin_email', email);
    formdata.append('password', password);

    dispatch(adminLoginApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success === true) {
          setAlert({ type: 'success', msg: res.msg || 'Admin login successful!' });
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 800);
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Invalid credentials' });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Login failed: ' + err.message });
      });
  };

  return (
    <div className="admin-login-page min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5 px-3">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle bg-primary-subtle text-primary mb-3">
            <FaShieldAlt size={36} />
          </div>
          <h4 className="fw-bold text-dark mb-1">e-Shoping Admin Panel</h4>
          <p className="text-muted small">Manage categories, products, orders & ads</p>
        </div>

        {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="admin@eshoping.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-text small text-muted mt-1">
              Demo Credentials: <strong>admin@eshoping.com</strong> / <strong>admin123</strong>
            </div>
          </div>

          <div className="d-grid mb-3">
            <CustomButton type="submit" variant="primary" loading={loading} className="py-2">
              Sign In to Admin Dashboard
            </CustomButton>
          </div>

          <div className="text-center">
            <Link to="/" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
              <FaArrowLeft size={10} /> Back to Customer Store
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
