import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import { FaTrash, FaArrowRight, FaShieldAlt, FaShoppingBag } from 'react-icons/fa';
import '../../assets/Css/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.products);

  const handleUpdateQty = (product_id, newQty) => {
    dispatch({
      type: 'UPDATE_CART_QTY',
      payload: { product_id, quantity: newQty }
    });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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

  return (
    <div className="cart-page bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container-fluid px-lg-5 py-4 flex-grow-1">
        <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <FaShoppingBag className="text-primary" />
          <span>Shopping Cart ({cart.reduce((a, b) => a + (b.quantity || 1), 0)} items)</span>
        </h4>

        {cart.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
            <div className="mb-3">
              <FaShoppingBag size={56} className="text-muted" />
            </div>
            <h4 className="fw-bold text-dark mb-2">Your Cart is Empty!</h4>
            <p className="text-muted small mb-4">
              Explore our wide range of attendance machines, printers, and CCTV hardware.
            </p>
            <div>
              <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold">
                Shop Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Column: Cart Items List */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <span className="fw-bold text-dark">Cart Products</span>
                  <button
                    className="btn btn-link text-danger text-decoration-none btn-sm p-0"
                    onClick={handleClearCart}
                  >
                    Clear All Items
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {cart.map((item) => {
                    const mPrice = parseFloat(item.market_price) || 0;
                    const sPrice = parseFloat(item.sale_price) || 0;
                    const discount = item.discount_percent || (mPrice > sPrice ? Math.round(((mPrice - sPrice) / mPrice) * 100) : 0);

                    return (
                      <div
                        key={item.product_id}
                        className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border-bottom pb-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop'}
                            alt={item.product_name}
                            className="rounded border p-1"
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                          />
                          <div>
                            {item.model && (
                              <span className="badge bg-light text-secondary border small mb-1">
                                {item.model}
                              </span>
                            )}
                            <h6 className="fw-bold text-dark mb-1">{item.product_name}</h6>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold text-dark">₹{sPrice.toLocaleString()}</span>
                              {mPrice > sPrice && (
                                <span className="text-muted text-decoration-line-through small">
                                  ₹{mPrice.toLocaleString()}
                                </span>
                              )}
                              {discount > 0 && (
                                <span className="text-success fw-bold small">
                                  {discount}% off
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3">
                          <div className="input-group input-group-sm" style={{ width: '100px' }}>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleUpdateQty(item.product_id, (item.quantity || 1) - 1)}
                            >
                              -
                            </button>
                            <span className="form-control text-center fw-bold bg-white">
                              {item.quantity || 1}
                            </span>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleUpdateQty(item.product_id, (item.quantity || 1) + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="btn btn-outline-danger btn-sm p-2"
                            title="Remove item"
                            onClick={() => handleUpdateQty(item.product_id, 0)}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secure Checkout Assurance */}
              <div className="p-3 bg-white rounded-3 shadow-sm border d-flex align-items-center gap-3">
                <FaShieldAlt className="text-success fs-3 flex-shrink-0" />
                <span className="small text-secondary">
                  Safe and Secure Payments. 100% Authentic hardware with manufacturer warranty and invoice.
                </span>
              </div>
            </div>

            {/* Right Column: Price Details Card (Flipkart style) */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white sticky-top" style={{ top: '80px' }}>
                <h6 className="fw-bold text-muted border-bottom pb-2 mb-3 text-uppercase small">
                  Price Details
                </h6>

                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Price ({cart.reduce((a, b) => a + (b.quantity || 1), 0)} items)</span>
                  <span>₹{totalMarketPrice.toLocaleString()}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 small text-success">
                    <span>Discount</span>
                    <span>- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3 small text-secondary">
                  <span>Delivery Charges</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>

                <div className="d-flex justify-content-between border-top pt-3 mb-3 fw-bold text-dark fs-5">
                  <span>Total Amount</span>
                  <span>₹{totalSalePrice.toLocaleString()}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    You will save ₹{totalDiscount.toLocaleString()} on this order!
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-warning w-100 py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  onClick={() => navigate('/checkout')}
                >
                  <span>PLACE ORDER</span>
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
