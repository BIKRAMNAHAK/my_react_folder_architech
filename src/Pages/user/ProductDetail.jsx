import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import CustomLoader from '../../Components/CustomLoader';
import { getProductDetailApi } from '../../Services/Actions/getApis';
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaWhatsapp,
  FaShieldAlt,
  FaTruck,
  FaSync,
  FaTag,
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa';
import '../../assets/Css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct } = useSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const fd = new FormData();
      fd.append('action', 'GET_PRODUCT_DETAIL');
      fd.append('product_id', productId);
      const res = await dispatch(getProductDetailApi(fd));
      if (res && res.data) {
        setSelectedImage(res.data.cover_image);
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId, dispatch]);

  if (loading || !currentProduct) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <CustomNavbar />
        <div className="container py-5 flex-grow-1">
          <CustomLoader text="Loading product details and gallery..." fullPage={true} />
        </div>
        <Footer />
      </div>
    );
  }

  const marketPrice = parseFloat(currentProduct.market_price) || 0;
  const salePrice = parseFloat(currentProduct.sale_price) || 0;
  const discount = currentProduct.discount_percent || (marketPrice > salePrice ? Math.round(((marketPrice - salePrice) / marketPrice) * 100) : 0);

  // Gallery images array
  const allImages = [
    currentProduct.cover_image,
    ...(currentProduct.gallery || [])
  ].filter(Boolean);
  // Deduplicate
  const uniqueImages = Array.from(new Set(allImages));

  // Features list
  const detailPoints = (currentProduct.details || '')
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...currentProduct, quantity }
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleBuyNow = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...currentProduct, quantity }
    });
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I want to enquire about ${currentProduct.product_name} (Model: ${currentProduct.model || 'N/A'}). Listed Sale Price: ₹${salePrice}. Please provide software compatibility and bulk discount details.`
  );

  return (
    <div className="product-detail-page bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container-fluid px-lg-5 py-4 flex-grow-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-primary">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/category/${currentProduct.category_slug || currentProduct.category_id}`} className="text-decoration-none text-primary">
                {currentProduct.category_name || 'Category'}
              </Link>
            </li>
            <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>
              {currentProduct.product_name}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        {/* Product Details Main Card */}
        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
          <div className="row g-4">
            {/* Left Column: Gallery & Image Preview (Flipkart style) */}
            <div className="col-lg-5">
              <div className="d-flex flex-column flex-md-row gap-3">
                {/* Thumbnails Sidebar */}
                {uniqueImages.length > 1 && (
                  <div className="d-flex flex-md-column gap-2 order-2 order-md-1 gallery-thumb-list">
                    {uniqueImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className={`gallery-thumb-item p-1 rounded border ${
                          selectedImage === imgUrl ? 'border-primary border-2 active-thumb' : ''
                        }`}
                        onClick={() => setSelectedImage(imgUrl)}
                        style={{ cursor: 'pointer', width: '60px', height: '60px' }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-100 h-100 rounded"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Large Image */}
                <div className="flex-grow-1 order-1 order-md-2 text-center p-3 border rounded position-relative main-image-box">
                  {discount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 fs-6">
                      {discount}% OFF
                    </span>
                  )}
                  <img
                    src={selectedImage || currentProduct.cover_image}
                    alt={currentProduct.product_name}
                    className="img-fluid rounded main-preview-img"
                    style={{ maxHeight: '380px', objectFit: 'contain' }}
                  />
                </div>
              </div>

              {/* Action Buttons Below Image */}
              <div className="d-grid gap-2 d-flex mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary flex-fill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-xs"
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart size={15} />
                  <span>ADD TO CART</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-fill py-2 fw-bold text-white d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm"
                  onClick={handleBuyNow}
                >
                  <FaBolt size={15} />
                  <span>INSTANT ORDER</span>
                </button>
              </div>

              {addedAlert && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mt-3 small">
                  <FaCheck /> Added to your shopping cart!
                </div>
              )}
            </div>

            {/* Right Column: Specifications & Pricing */}
            <div className="col-lg-7">
              {/* Model and Category Tag */}
              <div className="d-flex align-items-center gap-2 mb-2">
                {currentProduct.model && (
                  <span className="badge bg-light text-secondary border font-monospace text-uppercase">
                    Model: {currentProduct.model}
                  </span>
                )}
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                  {currentProduct.category_name}
                </span>
              </div>

              {/* Title */}
              <h3 className="fw-bold text-dark mb-2">{currentProduct.product_name}</h3>

              {/* Rating and Reviews */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success d-inline-flex align-items-center gap-1 py-1 px-2" style={{ fontSize: '0.85rem' }}>
                  4.8 <FaStar size={11} />
                </span>
                <span className="text-muted small">Verified Client Ratings</span>
                <span className="badge bg-info-subtle text-info border border-info-subtle small">
                  Enterprise Certified & Inspected
                </span>
              </div>

              {/* Price Block */}
              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="d-flex align-items-baseline gap-3">
                  <span className="display-6 fw-bold text-dark">
                    ₹{salePrice.toLocaleString()}
                  </span>
                  {marketPrice > salePrice && (
                    <span className="fs-5 text-muted text-decoration-line-through">
                      ₹{marketPrice.toLocaleString()}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="fs-5 text-success fw-bold">
                      {discount}% off
                    </span>
                  )}
                </div>
                <p className="text-muted small mb-0 mt-1">
                  Inclusive of all taxes. Free shipping on this hardware order.
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <label className="fw-semibold text-dark small mb-0">Quantity:</label>
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control form-control-sm text-center fw-bold"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="text-success small fw-medium">In Stock ({currentProduct.stock || 50} units available)</span>
              </div>

              {/* WhatsApp Enquiry Button */}
              <div className="mb-4">
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm"
                >
                  <FaWhatsapp size={18} /> Enquire for Bulk / Corporate Order on WhatsApp
                </a>
              </div>

              {/* Specifications / Features List */}
              <div className="border-top pt-3 mb-4">
                <h6 className="fw-bold text-dark mb-3">Key Features & Technical Specifications:</h6>
                {detailPoints.length > 0 ? (
                  <ul className="list-group list-group-flush small">
                    {detailPoints.map((point, idx) => (
                      <li key={idx} className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                        <FaCheck className="text-primary mt-1 flex-shrink-0" size={12} />
                        <span className="text-secondary">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small">Standard technical specifications apply.</p>
                )}
              </div>

              {/* Software Integration Assurances */}
              <div className="row g-2 border-top pt-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                    <FaShieldAlt className="text-primary" />
                    <span className="small text-secondary">1 Year Warranty</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                    <FaSync className="text-success" />
                    <span className="small text-secondary">Software Driver Included</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                    <FaTruck className="text-warning" />
                    <span className="small text-secondary">Fast Onsite Delivery</span>
                  </div>
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

export default ProductDetail;
