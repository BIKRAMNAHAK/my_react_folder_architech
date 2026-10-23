import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaStar, FaBolt, FaCheckCircle } from 'react-icons/fa';
import '../assets/Css/Home.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/product/${product.product_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 }
    });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 }
    });
    navigate('/checkout');
  };

  // Safe discount calculation
  const marketPrice = parseFloat(product.market_price) || 0;
  const salePrice = parseFloat(product.sale_price) || 0;
  const discount = product.discount_percent || (marketPrice > salePrice ? Math.round(((marketPrice - salePrice) / marketPrice) * 100) : 0);

  return (
    <div className="tech-product-card h-100" onClick={handleCardClick}>
      {/* Auto-Calculated Discount Badge */}
      {discount > 0 && (
        <span className="tech-badge-discount position-absolute top-0 start-0 m-1">
          {discount}% OFF
        </span>
      )}

      {/* Product Image Container */}
      <div className="tech-card-img-container">
        <img
          src={product.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop'}
          alt={product.product_name}
          className="tech-product-img"
          loading="lazy"
        />
      </div>

      <div className="p-2 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          {/* Model Tag & Status */}
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="badge bg-light text-secondary border font-monospace text-truncate"
              style={{ fontSize: '0.62rem', maxWidth: '100px', padding: '0.15rem 0.35rem' }}
            >
              {product.model || 'HW-DEV'}
            </span>
            <span
              className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.6rem', padding: '0.15rem 0.35rem' }}
            >
              <FaCheckCircle size={8} /> Verified
            </span>
          </div>

          {/* Product Name */}
          <h6 className="tech-product-title mb-1" title={product.product_name}>
            {product.product_name}
          </h6>

          {/* Star Rating Tag */}
          <div className="d-flex align-items-center gap-1 mb-2">
            <span
              className="badge bg-primary text-white d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.65rem', padding: '0.12rem 0.35rem' }}
            >
              4.8 <FaStar size={8} />
            </span>
            <span className="text-muted" style={{ fontSize: '0.68rem' }}>Asspected</span>
          </div>
        </div>

        <div>
          {/* Price Section */}
          <div className="d-flex align-items-baseline gap-1 mb-2">
            <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
              ₹{salePrice.toLocaleString()}
            </span>
            {marketPrice > salePrice && (
              <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.72rem' }}>
                ₹{marketPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-1">
            <button
              type="button"
              className="tech-btn-add flex-fill d-flex align-items-center justify-content-center gap-1"
              onClick={handleAddToCart}
              title="Add to shopping cart"
            >
              <FaShoppingCart size={10} />
              <span>Add</span>
            </button>
            <button
              type="button"
              className="tech-btn-buy flex-fill d-flex align-items-center justify-content-center gap-1"
              onClick={handleBuyNow}
              title="Instant Order"
            >
              <FaBolt size={9} />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
