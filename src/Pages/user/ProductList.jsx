import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import CustomLoader from '../../Components/CustomLoader';
import { getProductsByCategoryApi, getCategoriesApi } from '../../Services/Actions/getApis';
import { FaStar, FaShoppingCart, FaBolt, FaFilter, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import '../../assets/Css/ProductList.css';

const ProductList = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categoryProducts, categories } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [maxPrice, setMaxPrice] = useState(50000);

  // Find category details from categories store
  const activeCategory = categories.find(
    (c) => c.slug === categorySlug || String(c.category_id) === String(categorySlug)
  );

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      // Ensure categories are loaded
      if (!categories || categories.length === 0) {
        const catFd = new FormData();
        catFd.append('action', 'GET_CATEGORIES');
        await dispatch(getCategoriesApi(catFd));
      }

      const fd = new FormData();
      fd.append('action', 'GET_PRODUCTS_BY_CATEGORY');
      if (isNaN(categorySlug)) {
        fd.append('slug', categorySlug);
      } else {
        fd.append('category_id', categorySlug);
      }
      await dispatch(getProductsByCategoryApi(fd));
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [categorySlug, dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 }
    });
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 }
    });
    navigate('/checkout');
  };

  // Sort and filter products
  const filteredProducts = (categoryProducts || [])
    .filter((p) => parseFloat(p.sale_price) <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price_low') return parseFloat(a.sale_price) - parseFloat(b.sale_price);
      if (sortBy === 'price_high') return parseFloat(b.sale_price) - parseFloat(a.sale_price);
      if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
      return b.product_id - a.product_id;
    });

  return (
    <div className="product-list-page bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container-fluid px-lg-5 py-4 flex-grow-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-primary">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {activeCategory ? activeCategory.category_name : 'Products'}
            </li>
          </ol>
        </nav>

        {/* Category Header Banner */}
        <div className="category-header-banner bg-white rounded-3 shadow-sm p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <button
                className="btn btn-outline-secondary btn-sm p-1 rounded-circle"
                onClick={() => navigate('/')}
                title="Back to Home"
              >
                <FaArrowLeft size={12} />
              </button>
              <h3 className="fw-bold text-dark mb-0">
                {activeCategory ? activeCategory.category_name : 'Product Listing'}
              </h3>
            </div>
            <p className="text-muted small mb-0">
              {activeCategory?.description || 'Authentic hardware bundled with enterprise software support.'}
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small fw-medium">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted mb-0 fw-semibold">Sort by:</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Latest & Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          {/* Left Filter Sidebar - Firmly Sticky & Fixed on Desktop */}
          <div className="col-lg-3 d-none d-lg-block" style={{ position: 'sticky', top: '85px', zIndex: 20 }}>
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-3">
                <FaFilter className="text-primary" />
                <h6 className="fw-bold text-dark mb-0">Filter Hardware</h6>
              </div>

              {/* Price Range Filter - Fixed Range Control */}
              <div className="mb-3">
                <label className="form-label small fw-semibold d-flex justify-content-between mb-1">
                  <span>Price Range Limit:</span>
                  <span className="text-primary fw-bold">Up to ₹{maxPrice.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                  <span>₹2,000</span>
                  <span>₹50,000+</span>
                </div>

                {/* Quick Select Range Pills */}
                <div className="d-flex flex-wrap gap-1 mt-2">
                  <button
                    type="button"
                    className={`btn btn-xs px-2 py-1 rounded-pill ${maxPrice === 10000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.68rem' }}
                    onClick={() => setMaxPrice(10000)}
                  >
                    &lt; ₹10k
                  </button>
                  <button
                    type="button"
                    className={`btn btn-xs px-2 py-1 rounded-pill ${maxPrice === 20000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.68rem' }}
                    onClick={() => setMaxPrice(20000)}
                  >
                    &lt; ₹20k
                  </button>
                  <button
                    type="button"
                    className={`btn btn-xs px-2 py-1 rounded-pill ${maxPrice === 35000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.68rem' }}
                    onClick={() => setMaxPrice(35000)}
                  >
                    &lt; ₹35k
                  </button>
                  <button
                    type="button"
                    className={`btn btn-xs px-2 py-1 rounded-pill ${maxPrice === 50000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.68rem' }}
                    onClick={() => setMaxPrice(50000)}
                  >
                    All Items
                  </button>
                </div>
              </div>

              {/* Quality Assurances */}
              <div className="border-top pt-2">
                <h6 className="fw-bold small text-dark mb-2" style={{ fontSize: '0.78rem' }}>Our Quality Promise</h6>
                <ul className="list-unstyled text-muted d-flex flex-column gap-1 mb-0" style={{ fontSize: '0.74rem' }}>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" /> 1 Year Onsite Warranty
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" /> Pre-Configured with Software
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" /> 7 Days Replacement
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" /> GST Invoice Provided
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Product List Area - Compact & Sleek Cards */}
          <div className="col-lg-9">
            {loading ? (
              <CustomLoader text="Loading category products..." fullPage={false} />
            ) : filteredProducts.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {filteredProducts.map((product) => {
                  const marketPrice = parseFloat(product.market_price) || 0;
                  const salePrice = parseFloat(product.sale_price) || 0;
                  const discount = product.discount_percent || (marketPrice > salePrice ? Math.round(((marketPrice - salePrice) / marketPrice) * 100) : 0);
                  const detailPoints = (product.details || '').split('|').map((pt) => pt.trim()).filter(Boolean);

                  return (
                    <div
                      key={product.product_id}
                      className="tech-list-card card border-0 shadow-sm rounded-3 p-2 p-md-3 bg-white"
                      onClick={() => handleProductClick(product.product_id)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div className="row g-2 align-items-center">
                        {/* Product Image Column - Compact */}
                        <div className="col-md-3 col-sm-4 text-center">
                          <div className="list-card-img-wrapper p-1 position-relative">
                            {discount > 0 && (
                              <span className="badge bg-success position-absolute top-0 start-0 m-1" style={{ fontSize: '0.62rem' }}>
                                {discount}% OFF
                              </span>
                            )}
                            <img
                              src={product.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop'}
                              alt={product.product_name}
                              className="img-fluid rounded list-prod-img"
                              style={{ maxHeight: '115px', objectFit: 'contain' }}
                            />
                          </div>
                        </div>

                        {/* Product Info & Specifications Column */}
                        <div className="col-md-6 col-sm-8">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            {product.model && (
                              <span className="badge bg-light text-secondary border font-monospace text-uppercase" style={{ fontSize: '0.62rem', padding: '0.15rem 0.35rem' }}>
                                {product.model}
                              </span>
                            )}
                            <span className="badge bg-primary text-white d-inline-flex align-items-center gap-1" style={{ fontSize: '0.65rem', padding: '0.12rem 0.35rem' }}>
                              4.8 <FaStar size={8} />
                            </span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold" style={{ fontSize: '0.62rem', padding: '0.12rem 0.35rem' }}>
                              Verified Hardware
                            </span>
                          </div>

                          <h6 className="fw-bold text-dark mb-1 list-prod-name" style={{ fontSize: '0.92rem' }}>
                            {product.product_name}
                          </h6>

                          {/* Bullet Specifications */}
                          <ul className="list-unstyled text-secondary mb-0 list-specs-bullets" style={{ fontSize: '0.75rem' }}>
                            {detailPoints.length > 0 ? (
                              detailPoints.slice(0, 3).map((point, idx) => (
                                <li key={idx} className="mb-0 text-truncate">
                                  • {point}
                                </li>
                              ))
                            ) : (
                              <li>• High performance hardware with software driver support</li>
                            )}
                          </ul>
                        </div>

                        {/* Pricing & CTA Column - Compact */}
                        <div className="col-md-3 col-12 border-start-md text-md-end pt-2 pt-md-0">
                          <div className="mb-2">
                            <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                              ₹{salePrice.toLocaleString()}
                            </div>
                            {marketPrice > salePrice && (
                              <div className="d-flex align-items-center justify-content-md-end gap-1">
                                <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.72rem' }}>
                                  ₹{marketPrice.toLocaleString()}
                                </span>
                                {discount > 0 && (
                                  <span className="text-success fw-bold" style={{ fontSize: '0.72rem' }}>
                                    {discount}% off
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="text-success fw-medium d-block mt-0" style={{ fontSize: '0.7rem' }}>
                              ✓ Free Delivery Included
                            </span>
                          </div>

                          <div className="d-grid gap-1 mt-2">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm fw-bold d-flex align-items-center justify-content-center gap-1 rounded-pill py-1"
                              style={{ fontSize: '0.78rem' }}
                              onClick={(e) => handleBuyNow(e, product)}
                            >
                              <FaBolt size={10} /> Instant Order
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1 rounded-pill py-1"
                              style={{ fontSize: '0.74rem' }}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <FaShoppingCart size={11} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <h5 className="fw-bold text-muted mb-2">No Products in this Category Yet</h5>
                <p className="text-muted small">Products will appear once added by Admin.</p>
                <Link to="/" className="btn btn-primary btn-sm">
                  Back to Homepage
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
