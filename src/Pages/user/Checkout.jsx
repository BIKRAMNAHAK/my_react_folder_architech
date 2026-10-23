import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import CustomAlert from '../../Components/CustomAlert';
import CustomButton from '../../Components/CustomButton';
import { placeOrderApi, addAddressApi } from '../../Services/Actions/postApis';
import { getAddressesApi } from '../../Services/Actions/getApis';
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
  FaShoppingBag,
  FaPlus,
  FaShieldAlt,
  FaCheck
} from 'react-icons/fa';
import '../../assets/Css/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.products);
  const { user, addresses } = useSelector((state) => state.user);

  // Active Checkout Step: 1 = Contact Details, 2 = Delivery Address, 3 = Payment & Place Order
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Customer Contact State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    mobile: '',
    alt_mobile: ''
  });

  // Selected Address State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryAddressText, setDeliveryAddressText] = useState('');

  // New Address Form State (if user wants to add another address here)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'residential'
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  // UI state
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  // Sync user info and load addresses
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        alt_mobile: user.alt_mobile || ''
      });
      // Fetch user's addresses
      const fd = new FormData();
      fd.append('action', 'GET_ADDRESSES');
      fd.append('user_id', user.user_id || 1);
      dispatch(getAddressesApi(fd));
    }
  }, [user, dispatch]);

  // When addresses load, default-select the first one and autofill
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      handleSelectAddress(defaultAddr);
    }
  }, [addresses]);

  // 1-Click Address Selection & Auto-Fill Handler
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.address_id);
    const fullText = `${addr.address_line1}, ${addr.address_line2 ? addr.address_line2 + ', ' : ''}${addr.city}, ${addr.state} - ${addr.pincode} (${addr.address_type?.toUpperCase()})`;
    setDeliveryAddressText(fullText);
  };

  // Save new address from checkout
  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.address_line1 || !newAddr.city || !newAddr.state || !newAddr.pincode) {
      setAlert({ type: 'error', msg: 'Please fill all required address fields' });
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('action', 'ADD_ADDRESS');
    fd.append('user_id', user?.user_id || 1);
    fd.append('address_line1', newAddr.address_line1);
    fd.append('address_line2', newAddr.address_line2 || '');
    fd.append('city', newAddr.city);
    fd.append('state', newAddr.state);
    fd.append('pincode', newAddr.pincode);
    fd.append('address_type', newAddr.address_type);

    dispatch(addAddressApi(fd))
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setAlert({ type: 'success', msg: 'New address added and selected!' });
          setShowNewAddressForm(false);
          // Refresh addresses list
          const getFd = new FormData();
          getFd.append('action', 'GET_ADDRESSES');
          getFd.append('user_id', user?.user_id || 1);
          dispatch(getAddressesApi(getFd));
          // Auto-select this address
          const fullText = `${newAddr.address_line1}, ${newAddr.address_line2 ? newAddr.address_line2 + ', ' : ''}${newAddr.city}, ${newAddr.state} - ${newAddr.pincode} (${newAddr.address_type.toUpperCase()})`;
          setDeliveryAddressText(fullText);
        } else {
          setAlert({ type: 'error', msg: res.msg });
        }
      })
      .catch(() => setLoading(false));
  };

  // Calculations
  const totalMarketPrice = cart.reduce(
    (sum, item) => sum + (parseFloat(item.market_price) || parseFloat(item.sale_price) || 0) * (item.quantity || 1),
    0
  );
  const totalSalePrice = cart.reduce(
    (sum, item) => sum + (parseFloat(item.sale_price) || 0) * (item.quantity || 1),
    0
  );
  const totalDiscount = totalMarketPrice - totalSalePrice;

  // Final Order Submission using user requested FormData syntax
  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.mobile) {
      setAlert({ type: 'error', msg: 'Please provide Customer Name and Mobile Number.' });
      setCheckoutStep(1);
      return;
    }

    if (!deliveryAddressText) {
      setAlert({ type: 'error', msg: 'Please select or add a Delivery Address.' });
      setCheckoutStep(2);
      return;
    }

    if (cart.length === 0) {
      setAlert({ type: 'error', msg: 'Your cart is empty!' });
      return;
    }

    setLoading(true);

    // Retrieve referral ad if visited from an ad
    const referralAdId = localStorage.getItem('eshop_referral_ad_id') || 0;

    const formdata = new FormData();
    formdata.append('action', 'PLACE_ORDER');
    formdata.append('user_id', user?.user_id || 1);
    formdata.append('address_id', selectedAddressId || 0);
    formdata.append('customer_name', customerInfo.name);
    formdata.append('customer_phone', customerInfo.mobile);
    formdata.append('delivery_address', deliveryAddressText);
    formdata.append('total_amount', totalMarketPrice);
    formdata.append('discount_amount', totalDiscount);
    formdata.append('final_amount', totalSalePrice);
    formdata.append('payment_method', paymentMethod);
    formdata.append('referral_ad_id', referralAdId);
    formdata.append('items', JSON.stringify(cart));

    dispatch(placeOrderApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success === true) {
          // Clear cart
          dispatch({ type: 'CLEAR_CART' });
          localStorage.removeItem('eshop_referral_ad_id');
          // Navigate to success page
          navigate(`/order-success/${res.data?.order_id || 1001}`);
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Failed to place order' });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Order submission failed: ' + err.message });
      });
  };

  if (cart.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <CustomNavbar />
        <div className="container py-5 text-center flex-grow-1">
          <div className="card p-5 bg-white border-0 shadow-sm rounded-3">
            <FaShoppingBag size={50} className="text-muted mb-3" />
            <h4 className="fw-bold">No Items in Cart for Checkout</h4>
            <p className="text-muted small">Please add products to your cart before proceeding.</p>
            <div>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Browse Hardware Catalog
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container-fluid px-lg-5 py-4 flex-grow-1">
        {/* Page Title */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaShieldAlt className="text-success fs-4" />
          <h4 className="fw-bold text-dark mb-0">Secure Step-by-Step Checkout</h4>
        </div>

        {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

        <div className="row g-4">
          {/* Left Column: Step-by-Step Accordion Form */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {/* -------------------------------------------------- */}
              {/* STEP 1: CUSTOMER CONTACT DETAILS                   */}
              {/* -------------------------------------------------- */}
              <div className={`card border-0 shadow-sm rounded-3 bg-white ${checkoutStep === 1 ? 'border-primary' : ''}`}>
                <div
                  className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCheckoutStep(1)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="step-num-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                      1
                    </span>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Customer & Contact Information</h6>
                      {customerInfo.name && (
                        <span className="text-muted small">
                          {customerInfo.name} | {customerInfo.mobile}
                        </span>
                      )}
                    </div>
                  </div>
                  {customerInfo.name && customerInfo.mobile && (
                    <span className="text-success small fw-bold d-flex align-items-center gap-1">
                      <FaCheck /> Done
                    </span>
                  )}
                </div>

                {checkoutStep === 1 && (
                  <div className="card-body pt-0 border-top">
                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Customer / Company Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Name / Business Name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Email Address (for Invoice) *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="billing@company.com"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Mobile Phone (for Delivery SMS) *</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="10-digit mobile number"
                          value={customerInfo.mobile}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Alternate Mobile</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Optional secondary phone"
                          value={customerInfo.alt_mobile}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, alt_mobile: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-4 fw-semibold"
                        onClick={() => {
                          if (!customerInfo.name || !customerInfo.mobile) {
                            setAlert({ type: 'error', msg: 'Name and Mobile number are required.' });
                            return;
                          }
                          setCheckoutStep(2);
                        }}
                      >
                        Continue to Delivery Address
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------- */}
              {/* STEP 2: DELIVERY ADDRESS (Auto-Fill from Profile)   */}
              {/* -------------------------------------------------- */}
              <div className={`card border-0 shadow-sm rounded-3 bg-white ${checkoutStep === 2 ? 'border-primary' : ''}`}>
                <div
                  className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCheckoutStep(2)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="step-num-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                      2
                    </span>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Delivery Address (1-Click Auto-Fill)</h6>
                      {deliveryAddressText && (
                        <span className="text-muted small text-truncate d-inline-block" style={{ maxWidth: '400px' }}>
                          {deliveryAddressText}
                        </span>
                      )}
                    </div>
                  </div>
                  {deliveryAddressText && (
                    <span className="text-success small fw-bold d-flex align-items-center gap-1">
                      <FaCheck /> Selected
                    </span>
                  )}
                </div>

                {checkoutStep === 2 && (
                  <div className="card-body pt-0 border-top">
                    <p className="text-muted small mb-3">
                      Select any of your saved addresses below for instant 1-click auto-fill, or add a new delivery location.
                    </p>

                    {/* Saved Addresses Cards (from Step 2 of Profile) */}
                    {addresses && addresses.length > 0 ? (
                      <div className="row g-2 mb-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.address_id;
                          return (
                            <div key={addr.address_id} className="col-md-6">
                              <div
                                className={`card p-3 rounded-3 border-2 h-100 address-select-card ${
                                  isSelected ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-white'
                                }`}
                                onClick={() => handleSelectAddress(addr)}
                                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <span className={`badge ${addr.address_type === 'office' ? 'bg-primary' : 'bg-success'} text-uppercase`}>
                                    {addr.address_type || 'residential'}
                                  </span>
                                  {isSelected && (
                                    <span className="badge bg-primary d-flex align-items-center gap-1">
                                      <FaCheckCircle size={10} /> Auto-Filled
                                    </span>
                                  )}
                                </div>
                                <p className="mb-1 text-dark fw-semibold small">
                                  {addr.address_line1} {addr.address_line2}
                                </p>
                                <p className="mb-0 text-muted small">
                                  {addr.city}, {addr.state} - <span className="fw-bold">{addr.pincode}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="alert alert-info small py-2 mb-3">
                        No saved address found. Please fill in your address below.
                      </div>
                    )}

                    {/* Add New Address Accordion Button */}
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      >
                        <FaPlus size={12} /> {showNewAddressForm ? 'Cancel New Address' : '+ Add New Address'}
                      </button>
                    </div>

                    {/* New Address Form if opened */}
                    {showNewAddressForm && (
                      <form onSubmit={handleSaveNewAddress} className="border p-3 rounded-3 bg-light mb-3">
                        <h6 className="fw-bold small text-dark mb-2">New Address Details</h6>
                        <div className="row g-2">
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Address Line 1 (Flat, House no., Street) *"
                              value={newAddr.address_line1}
                              onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Address Line 2 (Area, Landmark)"
                              value={newAddr.address_line2}
                              onChange={(e) => setNewAddr({ ...newAddr, address_line2: e.target.value })}
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="City *"
                              value={newAddr.city}
                              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="State *"
                              value={newAddr.state}
                              onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Pincode *"
                              value={newAddr.pincode}
                              onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-12">
                            <div className="d-flex gap-3 mt-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="checkout_addr_type"
                                  id="co_res"
                                  value="residential"
                                  checked={newAddr.address_type === 'residential'}
                                  onChange={(e) => setNewAddr({ ...newAddr, address_type: e.target.value })}
                                />
                                <label className="form-check-label small" htmlFor="co_res">Residential</label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="checkout_addr_type"
                                  id="co_off"
                                  value="office"
                                  checked={newAddr.address_type === 'office'}
                                  onChange={(e) => setNewAddr({ ...newAddr, address_type: e.target.value })}
                                />
                                <label className="form-check-label small" htmlFor="co_off">Office</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-end">
                          <CustomButton type="submit" variant="success" loading={loading}>
                            Save & Select This Address
                          </CustomButton>
                        </div>
                      </form>
                    )}

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-4 fw-semibold"
                        onClick={() => {
                          if (!deliveryAddressText) {
                            setAlert({ type: 'error', msg: 'Please select or add an address.' });
                            return;
                          }
                          setCheckoutStep(3);
                        }}
                      >
                        Continue to Payment & Review
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------- */}
              {/* STEP 3: PAYMENT METHOD & REVIEW                    */}
              {/* -------------------------------------------------- */}
              <div className={`card border-0 shadow-sm rounded-3 bg-white ${checkoutStep === 3 ? 'border-primary' : ''}`}>
                <div
                  className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCheckoutStep(3)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="step-num-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                      3
                    </span>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Payment Options & Final Confirmation</h6>
                      <span className="text-muted small">Mode: {paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {checkoutStep === 3 && (
                  <div className="card-body pt-0 border-top">
                    <div className="d-flex flex-column gap-2 mb-4 mt-2">
                      <div className="form-check p-3 border rounded-3 bg-light">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment_choice"
                          id="pm_cod"
                          value="Cash On Delivery"
                          checked={paymentMethod === 'Cash On Delivery'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label className="form-check-label fw-bold text-dark small ms-2" htmlFor="pm_cod">
                          Cash On Delivery / Pay on Hardware Setup
                        </label>
                        <p className="text-muted small mb-0 ms-2">
                          Pay cash or UPI directly when device is delivered & verified.
                        </p>
                      </div>

                      <div className="form-check p-3 border rounded-3 bg-light">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment_choice"
                          id="pm_upi"
                          value="UPI / Net Banking"
                          checked={paymentMethod === 'UPI / Net Banking'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label className="form-check-label fw-bold text-dark small ms-2" htmlFor="pm_upi">
                          Instant UPI / NetBanking / Corporate PO
                        </label>
                        <p className="text-muted small mb-0 ms-2">
                          Google Pay, PhonePe, Paytm, or Company Invoice payment.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <CustomButton
                        type="button"
                        variant="warning"
                        loading={loading}
                        onClick={handlePlaceOrder}
                        className="btn-lg px-4 text-dark fw-bold"
                        icon={<FaCheckCircle />}
                      >
                        CONFIRM & PLACE ORDER (₹{totalSalePrice.toLocaleString()})
                      </CustomButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Flipkart style) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white sticky-top" style={{ top: '80px' }}>
              <h6 className="fw-bold text-muted border-bottom pb-2 mb-3 text-uppercase small">
                Order Summary ({cart.length} items)
              </h6>

              {/* Items Mini List */}
              <div className="d-flex flex-column gap-2 mb-3 overflow-y-auto" style={{ maxHeight: '200px' }}>
                {cart.map((item) => (
                  <div key={item.product_id} className="d-flex align-items-center justify-content-between small">
                    <span className="text-truncate text-secondary" style={{ maxWidth: '180px' }}>
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="fw-bold text-dark">
                      ₹{(parseFloat(item.sale_price) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-top pt-2">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Total MRP:</span>
                  <span>₹{totalMarketPrice.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 small text-success">
                    <span>Discount Savings:</span>
                    <span>- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-3 small text-secondary">
                  <span>Shipping:</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 fw-bold text-dark fs-5">
                  <span>Total Payable:</span>
                  <span>₹{totalSalePrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
