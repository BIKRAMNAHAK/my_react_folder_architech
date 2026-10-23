import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getAdByIdApi } from '../../Services/Actions/getApis';
import { trackAdVisitApi, trackAdEnquiryApi } from '../../Services/Actions/postApis';
import CustomLoader from '../../Components/CustomLoader';
import {
  FaWhatsapp,
  FaShoppingBag,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaTag,
  FaHeadset
} from 'react-icons/fa';
import '../../assets/Css/AdOffer.css';

const AdOffer = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAd } = useSelector((state) => state.addvotisement);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAdCampaign = async () => {
      setLoading(true);
      const fd = new FormData();
      fd.append('action', 'GET_AD_BY_ID');
      fd.append('ad_id', adId || 1);

      await dispatch(getAdByIdApi(fd));

      // Track Visitor Count for Admin Dashboard
      const trackFd = new FormData();
      trackFd.append('action', 'TRACK_AD_VISIT');
      trackFd.append('ad_id', adId || 1);
      dispatch(trackAdVisitApi(trackFd));

      // Store referral ad ID in localStorage so subsequent purchase links to this ad
      localStorage.setItem('eshop_referral_ad_id', adId || '1');

      setLoading(false);
    };

    initAdCampaign();
  }, [adId, dispatch]);

  const handleEnquireNow = () => {
    // 1. Track enquiry in backend for Admin analytics
    const trackFd = new FormData();
    trackFd.append('action', 'TRACK_AD_ENQUIRY');
    trackFd.append('ad_id', adId || 1);
    dispatch(trackAdEnquiryApi(trackFd));

    // 2. Open WhatsApp with pre-composed inquiry
    const whatsappNum = currentAd?.whatsapp_number || '919876543210';
    const msg = encodeURIComponent(
      `Hello! I came across your special offer for "${currentAd?.title}" (Offer Price: ₹${currentAd?.offer_price}). Please share full details and delivery options.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${msg}`, '_blank');
  };

  const handleShopNow = () => {
    if (currentAd?.product_id) {
      navigate(`/product/${currentAd.product_id}`);
    } else {
      navigate('/');
    }
  };

  if (loading || !currentAd) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <CustomLoader text="Loading promotional hardware offer..." fullPage={true} />
      </div>
    );
  }

  const offerPrice = parseFloat(currentAd.offer_price) || parseFloat(currentAd.sale_price) || 0;
  const marketPrice = parseFloat(currentAd.market_price) || offerPrice * 1.35;
  const savings = Math.max(0, marketPrice - offerPrice);
  const discountPercent = marketPrice > offerPrice ? Math.round(((marketPrice - offerPrice) / marketPrice) * 100) : 30;

  return (
    <div className="ad-offer-page min-vh-100 d-flex flex-column bg-light">
      {/* Top Client Brand Bar */}
      <header className="ad-header py-3 bg-white shadow-sm border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary px-3 py-2 fw-bold text-uppercase">
              Special Client Promotion
            </span>
            <span className="text-muted small d-none d-md-inline">
              Exclusive Hardware & Software Bundle
            </span>
          </div>
          <Link to="/" className="btn btn-outline-dark btn-sm fw-bold">
            Visit e-Shoping Main Store <FaArrowRight size={11} className="ms-1" />
          </Link>
        </div>
      </header>

      {/* Main Campaign Hero Section */}
      <main className="container py-4 py-md-5 flex-grow-1">
        <div className="card border-0 shadow rounded-4 overflow-hidden bg-white">
          <div className="row g-0">
            {/* Left: Product Showcase & Visual Banner */}
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center align-items-center bg-light text-center border-end-lg">
              <span className="badge bg-danger fs-6 px-3 py-2 mb-3 shadow-sm pulse-badge">
                <FaTag className="me-1" /> {currentAd.discount_badge || `${discountPercent}% OFF FLASH DEAL`}
              </span>

              <div className="p-3 bg-white rounded-4 shadow-sm mb-3 position-relative" style={{ maxWidth: '400px' }}>
                <img
                  src={
                    currentAd.product_image ||
                    currentAd.banner_image ||
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&auto=format&fit=crop'
                  }
                  alt={currentAd.title}
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '320px', objectFit: 'contain' }}
                />
              </div>

              {currentAd.model && (
                <span className="badge bg-secondary-subtle text-dark border px-3 py-1 mb-2">
                  HARDWARE MODEL: {currentAd.model}
                </span>
              )}
              <div className="d-flex align-items-center gap-1 text-warning">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                <span className="text-dark small ms-1 fw-bold">4.9 / 5 Client Rated</span>
              </div>
            </div>

            {/* Right: Promotion Details & Dual Action Buttons */}
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                <span className="text-primary fw-bold text-uppercase small letter-spacing-1 d-block mb-1">
                  Limited Time Hardware Deal
                </span>

                <h2 className="fw-bold text-dark mb-3">
                  {currentAd.title}
                </h2>

                <p className="lead text-secondary mb-4 fs-6">
                  {currentAd.tagline || 'Fully compatible with all our software solutions, attendance tracking, and retail ERP billing.'}
                </p>

                {/* Pricing Box */}
                <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 mb-4">
                  <span className="text-muted small text-uppercase fw-semibold d-block">Special Offer Price</span>
                  <div className="d-flex align-items-baseline gap-3">
                    <span className="display-5 fw-bold text-primary">
                      ₹{offerPrice.toLocaleString()}
                    </span>
                    {marketPrice > offerPrice && (
                      <span className="fs-5 text-muted text-decoration-line-through">
                        ₹{marketPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="badge bg-success fs-6">
                      Save ₹{savings.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-success small fw-medium d-block mt-1">
                    ✓ Price inclusive of 18% GST + Free Onsite Delivery
                  </span>
                </div>

                {/* Key Benefits List */}
                <h6 className="fw-bold text-dark mb-2">What you get in this offer:</h6>
                <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-4">
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <span><strong>100% Genuine Certified Hardware</strong> with 1-Year Comprehensive Warranty</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <span><strong>Pre-configured Software Drivers</strong> ready to connect to your existing systems</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <span><strong>Free Remote Installation Support</strong> by our senior technical engineers</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <span><strong>7 Days Money-Back / Replacement</strong> guarantee</span>
                  </li>
                </ul>
              </div>

              {/* DUAL ACTION BUTTONS (As requested by user) */}
              <div className="d-flex flex-column flex-sm-row gap-3 pt-3 border-top">
                {/* 1. Enquire Now via WhatsApp */}
                <button
                  type="button"
                  className="btn btn-success btn-lg flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm py-3"
                  onClick={handleEnquireNow}
                >
                  <FaWhatsapp size={22} />
                  <span>ENQUIRE NOW</span>
                </button>

                {/* 2. Shop Now (Directly enters e-shopping store) */}
                <button
                  type="button"
                  className="btn btn-warning btn-lg flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold text-dark shadow-sm py-3"
                  onClick={handleShopNow}
                >
                  <FaShoppingBag size={20} />
                  <span>SHOP NOW</span>
                </button>
              </div>

              <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-2">
                <FaHeadset className="text-primary" />
                <span>Need customized corporate setup? WhatsApp enquiry receives reply within 5 mins!</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 bg-white border-top text-center small text-muted">
        <div className="container">
          e-Shoping Partner Portal. Clicks and enquiries are actively recorded for client account management.
        </div>
      </footer>
    </div>
  );
};

export default AdOffer;
