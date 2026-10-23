import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import {
  FaUser,
  FaMapMarkerAlt,
  FaCamera,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import {
  saveUserProfileApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  userLoginApi
} from '../Services/Actions/postApis';
import { getAddressesApi } from '../Services/Actions/getApis';
import CustomAlert from './CustomAlert';
import CustomButton from './CustomButton';
import '../assets/Css/Profile.css';

const ProfileModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { user, addresses } = useSelector((state) => state.user);

  // Active Tab / Step: 1 = Personal Details, 2 = Address Management, 3 = Login Tab
  const [activeStep, setActiveStep] = useState(1);

  // Step 1: Personal Details Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    alt_mobile: '',
    password: '',
    confirm_password: '',
    profile_pic: null,
    profile_pic_preview: ''
  });

  // Step 2: Address Form State
  const [addressData, setAddressData] = useState({
    address_id: null,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'residential',
    is_default: 0
  });

  // Alternate address toggle
  const [showAlternateForm, setShowAlternateForm] = useState(false);
  const [altAddressData, setAltAddressData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'office'
  });

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // UI state
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Sync user details when modal opens or user state updates
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        alt_mobile: user.alt_mobile || '',
        profile_pic_preview: user.profile_pic || ''
      }));
      // Fetch saved addresses
      const fd = new FormData();
      fd.append('action', 'GET_ADDRESSES');
      fd.append('user_id', user.user_id || 1);
      dispatch(getAddressesApi(fd));
    }
  }, [user, dispatch, show]);

  // Handle Step 1 File Upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profile_pic: file,
        profile_pic_preview: URL.createObjectURL(file)
      });
    }
  };

  // Submit Step 1: Personal Info
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email || !profileData.mobile) {
      setAlert({ type: 'error', msg: 'Please enter Name, Email, and Mobile Number.' });
      return;
    }
    if (!user && profileData.password && profileData.password !== profileData.confirm_password) {
      setAlert({ type: 'error', msg: 'Password and Confirm Password do not match.' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'SAVE_USER_PROFILE');
    if (user?.user_id) formdata.append('user_id', user.user_id);
    formdata.append('name', profileData.name);
    formdata.append('email', profileData.email);
    formdata.append('mobile', profileData.mobile);
    formdata.append('alt_mobile', profileData.alt_mobile || '');
    if (profileData.password) formdata.append('password', profileData.password);
    if (profileData.profile_pic) formdata.append('profile_pic', profileData.profile_pic);

    dispatch(saveUserProfileApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setAlert({ type: 'success', msg: res.msg || 'Step 1 saved successfully! Proceed to Step 2 for Address.' });
          // Auto advance to Step 2
          setTimeout(() => {
            setActiveStep(2);
            setAlert({ type: '', msg: '' });
          }, 1200);
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Failed to save profile' });
        }
      })
      .catch(() => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'An error occurred while saving profile' });
      });
  };

  // Submit Step 2: Primary Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressData.address_line1 || !addressData.city || !addressData.state || !addressData.pincode) {
      setAlert({ type: 'error', msg: 'Please fill Address Line 1, City, State, and Area Pincode.' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('user_id', user?.user_id || 1);
    formdata.append('address_line1', addressData.address_line1);
    formdata.append('address_line2', addressData.address_line2 || '');
    formdata.append('city', addressData.city);
    formdata.append('state', addressData.state);
    formdata.append('pincode', addressData.pincode);
    formdata.append('address_type', addressData.address_type);

    if (editingAddressId) {
      formdata.append('action', 'UPDATE_ADDRESS');
      formdata.append('address_id', editingAddressId);
      dispatch(updateAddressApi(formdata))
        .then((res) => {
          setLoading(false);
          setAlert({ type: res.success ? 'success' : 'error', msg: res.msg });
          resetAddressForm();
          refreshAddresses();
        })
        .catch(() => setLoading(false));
    } else {
      formdata.append('action', 'ADD_ADDRESS');
      dispatch(addAddressApi(formdata))
        .then((res) => {
          setLoading(false);
          setAlert({ type: res.success ? 'success' : 'error', msg: res.msg });

          // If alternate address was also filled, save it too
          if (showAlternateForm && altAddressData.address_line1 && altAddressData.city) {
            const altFd = new FormData();
            altFd.append('action', 'ADD_ADDRESS');
            altFd.append('user_id', user?.user_id || 1);
            altFd.append('address_line1', altAddressData.address_line1);
            altFd.append('address_line2', altAddressData.address_line2 || '');
            altFd.append('city', altAddressData.city);
            altFd.append('state', altAddressData.state);
            altFd.append('pincode', altAddressData.pincode);
            altFd.append('address_type', altAddressData.address_type);
            dispatch(addAddressApi(altFd)).then(() => refreshAddresses());
          }

          resetAddressForm();
          refreshAddresses();
        })
        .catch(() => setLoading(false));
    }
  };

  const refreshAddresses = () => {
    const fd = new FormData();
    fd.append('action', 'GET_ADDRESSES');
    fd.append('user_id', user?.user_id || 1);
    dispatch(getAddressesApi(fd));
  };

  const resetAddressForm = () => {
    setAddressData({
      address_id: null,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      address_type: 'residential',
      is_default: 0
    });
    setEditingAddressId(null);
    setShowAlternateForm(false);
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.address_id);
    setAddressData({
      address_id: addr.address_id,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      address_type: addr.address_type || 'residential',
      is_default: addr.is_default || 0
    });
  };

  const handleDeleteAddress = (address_id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const fd = new FormData();
      fd.append('action', 'DELETE_ADDRESS');
      fd.append('address_id', address_id);
      dispatch(deleteAddressApi(fd)).then((res) => {
        setAlert({ type: res.success ? 'success' : 'error', msg: res.msg });
        refreshAddresses();
      });
    }
  };

  // Handle Existing User Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setAlert({ type: 'error', msg: 'Please enter your registered email and password' });
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('action', 'USER_LOGIN');
    fd.append('email', loginData.email);
    fd.append('password', loginData.password);

    dispatch(userLoginApi(fd))
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setAlert({ type: 'success', msg: 'Logged in successfully!' });
          setTimeout(() => {
            setActiveStep(1);
            setAlert({ type: '', msg: '' });
          }, 800);
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Login failed' });
        }
      })
      .catch(() => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Login request failed' });
      });
  };

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
    setProfileData({
      name: '',
      email: '',
      mobile: '',
      alt_mobile: '',
      password: '',
      confirm_password: '',
      profile_pic: null,
      profile_pic_preview: ''
    });
    setAlert({ type: 'success', msg: 'Logged out successfully' });
    setActiveStep(1);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" className="profile-step-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <FaUser className="text-primary" />
          <span>{user ? 'My Profile & Addresses' : 'Setup Profile (Step-by-Step)'}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {/* Step Tabs Navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                activeStep === 1 ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => { setActiveStep(1); setAlert({ type: '', msg: '' }); }}
            >
              1. Personal Details
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                activeStep === 2 ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => { setActiveStep(2); setAlert({ type: '', msg: '' }); }}
            >
              2. Address Settings ({addresses?.length || 0})
            </button>
          </div>

          <div>
            {!user ? (
              <button
                className={`btn btn-sm ${activeStep === 3 ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => { setActiveStep(3); setAlert({ type: '', msg: '' }); }}
              >
                <FaSignInAlt className="me-1" /> Existing User? Login
              </button>
            ) : (
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" /> Logout ({user.name})
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Alert */}
        {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

        {/* ======================================================== */}
        {/* STEP 1: PERSONAL DETAILS FORM                            */}
        {/* ======================================================== */}
        {activeStep === 1 && (
          <form onSubmit={handleSaveProfile}>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img
                  src={
                    profileData.profile_pic_preview ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop'
                  }
                  alt="Profile Avatar"
                  className="rounded-circle border border-3 border-primary shadow-sm"
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                />
                <label
                  htmlFor="profilePicUpload"
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1 d-flex align-items-center justify-content-center"
                  style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                  title="Upload Profile Picture"
                >
                  <FaCamera size={13} />
                </label>
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="d-none"
                  onChange={handleProfilePicChange}
                />
              </div>
              <p className="text-muted small mt-1 mb-0">Upload Profile Photo</p>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={profileData.email}
                  disabled={!!user}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Alternate Mobile Number (Optional)</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Secondary phone"
                  value={profileData.alt_mobile}
                  onChange={(e) => setProfileData({ ...profileData, alt_mobile: e.target.value })}
                />
              </div>

              {!user && (
                <>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create password"
                      value={profileData.password}
                      onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Repeat password"
                      value={profileData.confirm_password}
                      onChange={(e) => setProfileData({ ...profileData, confirm_password: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={onHide}>
                Cancel
              </button>
              <CustomButton type="submit" variant="primary" loading={loading} icon={<FaCheck />}>
                Save & Proceed to Step 2
              </CustomButton>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 2: ADDRESS MANAGEMENT FORM                          */}
        {/* ======================================================== */}
        {activeStep === 2 && (
          <div>
            {/* List of Existing Addresses */}
            {addresses && addresses.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-danger" />
                  <span>Your Saved Addresses (Auto-filled on Order)</span>
                </h6>
                <div className="row g-2">
                  {addresses.map((addr) => (
                    <div key={addr.address_id} className="col-md-6">
                      <div className="card h-100 border p-3 rounded-3 shadow-none bg-light address-item-card">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className={`badge ${addr.address_type === 'office' ? 'bg-primary' : 'bg-success'} text-uppercase`}>
                            {addr.address_type || 'residential'}
                          </span>
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary p-1"
                              title="Edit address"
                              onClick={() => handleEditAddress(addr)}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Delete address"
                              onClick={() => handleDeleteAddress(addr.address_id)}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="mb-1 text-dark small fw-medium">
                          {addr.address_line1} {addr.address_line2}
                        </p>
                        <p className="mb-0 text-muted small">
                          {addr.city}, {addr.state} - <span className="fw-bold">{addr.pincode}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Input Form */}
            <form onSubmit={handleSaveAddress} className="border rounded-3 p-3 bg-white shadow-sm">
              <h6 className="fw-bold text-primary mb-3">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h6>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Address Line 1 (Flat, House no., Building, Street) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Flat 302, Green Valley Apartments"
                    value={addressData.address_line1}
                    onChange={(e) => setAddressData({ ...addressData, address_line1: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Address Line 2 (Area, Colony, Landmark)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Near Infocity Square"
                    value={addressData.address_line2}
                    onChange={(e) => setAddressData({ ...addressData, address_line2: e.target.value })}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City name"
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State name"
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Area PIN Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="6-digit PIN"
                    value={addressData.pincode}
                    onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                    required
                  />
                </div>

                {/* Address Type Radio Button */}
                <div className="col-12">
                  <label className="form-label small fw-semibold d-block">Address Type *</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address_type"
                        id="addr_res"
                        value="residential"
                        checked={addressData.address_type === 'residential'}
                        onChange={(e) => setAddressData({ ...addressData, address_type: e.target.value })}
                      />
                      <label className="form-check-label small fw-medium" htmlFor="addr_res">
                        Residential (Home)
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address_type"
                        id="addr_off"
                        value="office"
                        checked={addressData.address_type === 'office'}
                        onChange={(e) => setAddressData({ ...addressData, address_type: e.target.value })}
                      />
                      <label className="form-check-label small fw-medium" htmlFor="addr_off">
                        Office / Commercial
                      </label>
                    </div>
                  </div>
                </div>

                {/* Alternate Address Option */}
                {!editingAddressId && (
                  <div className="col-12 pt-2 border-top">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="chk_alt_addr"
                        checked={showAlternateForm}
                        onChange={(e) => setShowAlternateForm(e.target.checked)}
                      />
                      <label className="form-check-label small fw-semibold text-primary" htmlFor="chk_alt_addr">
                        + Add Alternate Address (Optional - open same form below)
                      </label>
                    </div>
                  </div>
                )}

                {/* Alternate Address Inputs */}
                {showAlternateForm && !editingAddressId && (
                  <div className="col-12 bg-light p-3 rounded-3 border mt-2">
                    <h6 className="fw-bold text-secondary mb-3 small">Alternate Address Details</h6>
                    <div className="row g-2">
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Alternate Address Line 1"
                          value={altAddressData.address_line1}
                          onChange={(e) => setAltAddressData({ ...altAddressData, address_line1: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Alternate Address Line 2"
                          value={altAddressData.address_line2}
                          onChange={(e) => setAltAddressData({ ...altAddressData, address_line2: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="City"
                          value={altAddressData.city}
                          onChange={(e) => setAltAddressData({ ...altAddressData, city: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="State"
                          value={altAddressData.state}
                          onChange={(e) => setAltAddressData({ ...altAddressData, state: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Pincode"
                          value={altAddressData.pincode}
                          onChange={(e) => setAltAddressData({ ...altAddressData, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                {editingAddressId && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetAddressForm}>
                    Cancel Edit
                  </button>
                )}
                <CustomButton type="submit" variant="success" loading={loading} icon={<FaPlus />}>
                  {editingAddressId ? 'Update Address' : 'Save Address for Checkout'}
                </CustomButton>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: EXISTING USER LOGIN FORM                         */}
        {/* ======================================================== */}
        {activeStep === 3 && (
          <form onSubmit={handleLoginSubmit} className="p-3">
            <h6 className="fw-bold mb-3 text-dark">Log In to Your Existing Account</h6>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <div className="d-flex justify-content-end gap-2 pt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveStep(1)}>
                Back to Register
              </button>
              <CustomButton type="submit" variant="primary" loading={loading} icon={<FaSignInAlt />}>
                Login
              </CustomButton>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
