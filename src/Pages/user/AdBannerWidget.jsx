import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import { getAdvertisementsApi } from '../../Services/Actions/getApis';
import { trackAdVisitApi } from '../../Services/Actions/postApis';
import { FaTag, FaArrowRight, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';
import '../../assets/Css/AdBanner.css';

const AdBannerWidget = () => {
  const dispatch = useDispatch();
  const { advertisements } = useSelector((state) => state.addvotisement);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      const fd = new FormData();
      fd.append('action', 'GET_ADVERTISEMENTS');
      await dispatch(getAdvertisementsApi(fd));
      setLoading(false);
    };

    fetchAds();
  }, [dispatch]);

  // Click on carousel slide -> redirect to the offer landing page
  const handleBannerClick = (ad) => {
    // Track click in backend
    const trackFd = new FormData();
    trackFd.append('action', 'TRACK_AD_VISIT');
    trackFd.append('ad_id', ad.ad_id);
    dispatch(trackAdVisitApi(trackFd));

    // Store referral ad ID for conversion tracking
    try {
      localStorage.setItem('eshop_referral_ad_id', String(ad.ad_id));
    } catch (e) {}

    const targetUrl = `/offer/${ad.ad_id}`;

    // If embedded inside an iframe on an external client site, redirect top window or open in new tab
    if (window.top !== window.self) {
      window.open(targetUrl, '_blank');
    } else {
      window.location.href = targetUrl;
    }
  };

  const adsList = advertisements && advertisements.length > 0 ? advertisements : [];

  if (loading || adsList.length === 0) {
    return (
      <div className="p-3 text-center bg-dark text-white rounded-3 small">
        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
        Loading Promotional Hardware Carousel Deals...
      </div>
    );
  }

  return (
    <div className="ad-banner-widget-container">
      <Carousel
        interval={3500}
        pause="hover"
        indicators={adsList.length > 1}
        controls={adsList.length > 1}
        className="rounded-3 overflow-hidden shadow-sm"
      >
        {adsList.map((ad) => {
          const offerPrice = parseFloat(ad.offer_price) || parseFloat(ad.sale_price) || 0;
          const marketPrice = parseFloat(ad.market_price) || offerPrice * 1.35;
          const discount = marketPrice > offerPrice ? Math.round(((marketPrice - offerPrice) / marketPrice) * 100) : 30;

          return (
            <Carousel.Item key={ad.ad_id}>
              <div
                className="ad-carousel-card p-3 p-md-4 rounded-3 d-flex align-items-center"
                onClick={() => handleBannerClick(ad)}
                title="Click to view full deal and enquire"
              >
                <div className="row g-3 align-items-center w-100 mx-0">
                  {/* Left Column: Product Showcase Photo */}
                  <div className="col-4 col-md-3 text-center">
                    <div className="banner-img-box">
                      <img
                        src={
                          ad.product_image ||
                          ad.banner_image ||
                          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop'
                        }
                        alt={ad.title}
                        className="banner-img"
                      />
                    </div>
                  </div>

                  {/* Middle Column: Details & Offer Pricing */}
                  <div className="col-8 col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span className="badge banner-badge-deal px-2 py-1 text-uppercase">
                        <FaTag size={10} className="me-1" />
                        {ad.discount_badge || `${discount}% OFF DEAL`}
                      </span>
                      {ad.model && (
                        <span className="badge bg-secondary-subtle text-white border border-secondary small">
                          MODEL: {ad.model}
                        </span>
                      )}
                    </div>

                    <h5 className="banner-prod-title text-truncate mb-1">{ad.title}</h5>

                    <p className="banner-prod-tagline mb-2 d-none d-sm-block">
                      {ad.tagline || 'Software bundled hardware with free remote installation and onsite warranty.'}
                    </p>

                    <div className="d-flex align-items-baseline gap-2">
                      <span className="banner-price-tag">
                        ₹{offerPrice.toLocaleString()}
                      </span>
                      {marketPrice > offerPrice && (
                        <span className="banner-mrp-tag">
                          ₹{marketPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="badge bg-success-subtle text-success border border-success-subtle small d-none d-md-inline">
                        Save {discount}%
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Click CTA Button */}
                  <div className="col-12 col-md-3 text-md-end text-center pt-2 pt-md-0 border-top-sm">
                    <button
                      type="button"
                      className="btn btn-warning fw-bold text-dark btn-sm px-3 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(ad);
                      }}
                    >
                      <span>Claim Deal</span>
                      <FaArrowRight size={11} />
                    </button>
                    <span className="d-block text-white-50 small mt-1" style={{ fontSize: '0.68rem' }}>
                      ⚡ Instant WhatsApp Enquiry Available
                    </span>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default AdBannerWidget;
