import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import CustomNavbar from '../../Components/CustomNavbar';
import Footer from '../../Components/Footer';
import HorizontalScrollRow from '../../Components/HorizontalScrollRow';
import CustomLoader from '../../Components/CustomLoader';
import AdBannerWidget from './AdBannerWidget';
import { getCategoriesApi, getProductsApi, getAdvertisementsApi } from '../../Services/Actions/getApis';
import {
  FaTag,
  FaCheckCircle,
  FaMicrochip,
  FaWhatsapp,
  FaArrowRight,
  FaShieldAlt,
  FaHeadset,
  FaSyncAlt,
  FaBolt
} from 'react-icons/fa';
import '../../assets/Css/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { categories, products } = useSelector((state) => state.products);
  const { advertisements } = useSelector((state) => state.addvotisement);
  const [loading, setLoading] = useState(true);

  // Read saved hotline settings if available
  const savedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('techno_matrix_settings') || '{}');
    } catch {
      return {};
    }
  })();
  const hotline = savedSettings.whatsappHotline || '9861012345';

  useEffect(() => {
    // Fetch categories, products, and ads
    const loadHomeData = async () => {
      setLoading(true);
      const catFd = new FormData();
      catFd.append('action', 'GET_CATEGORIES');
      await dispatch(getCategoriesApi(catFd));

      const prodFd = new FormData();
      prodFd.append('action', 'GET_PRODUCTS');
      await dispatch(getProductsApi(prodFd));

      const adFd = new FormData();
      adFd.append('action', 'GET_ADVERTISEMENTS');
      await dispatch(getAdvertisementsApi(adFd));

      setLoading(false);
    };

    loadHomeData();
  }, [dispatch]);

  return (
    <div className="home-page-container bg-light min-vh-100 d-flex flex-column">
      <CustomNavbar />

      <main className="container-fluid px-lg-5 py-3 flex-grow-1">
        {/* Modern Enterprise Tech Hero Banner - Compact & Impactful */}
        <div className="tech-hero-wrapper text-white p-3 p-md-4 mb-3">
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <span className="badge tech-badge-pulse px-2 py-1 fw-bold text-uppercase mb-2 d-inline-flex align-items-center gap-1 small" style={{ fontSize: '0.72rem' }}>
                <FaMicrochip size={11} />
                <span>Next-Gen Enterprise IT Hardware & Software</span>
              </span>

              <h2 className="fw-bold mb-2 tech-hero-title fs-3">
                Industrial Hardware & Smart Cloud ERP Solutions
              </h2>

              <p className="text-light-50 small mb-3 tech-hero-subtitle" style={{ fontSize: '0.88rem' }}>
                Biometric Fingerprint & Face Attendance Machines, All-in-One Printers, POS Scanners & CCTV Security with 1-Year On-site Warranty.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/category/biometric-attendance"
                  className="btn btn-primary btn-sm fw-bold px-3 py-1 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                >
                  <FaBolt size={11} />
                  <span>Explore Hardware</span>
                </Link>

                <a
                  href={`https://wa.me/91${hotline}?text=${encodeURIComponent(
                    'Hello TECHNO MATRIX, I would like to request a bulk corporate quote and demo for office hardware devices.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm fw-bold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2"
                >
                  <FaWhatsapp className="text-success" size={14} />
                  <span>Instant WhatsApp Quote</span>
                </a>
              </div>
            </div>

            <div className="col-lg-4 d-none d-lg-block text-center">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop"
                alt="Enterprise Hardware Solutions"
                className="img-fluid tech-hero-img"
                style={{ maxHeight: '160px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Client Advertisement Carousel Banner (Based on length / responsive width) */}
        <div className="mb-4">
          <AdBannerWidget />
        </div>

        {/* Modern Tech Assurance Strip */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="tech-assurance-card h-100 d-flex align-items-center gap-3">
              <div className="tech-assurance-icon bg-primary-subtle text-primary">
                <FaCheckCircle size={20} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark small">100% Genuine Hardware</h6>
                <span className="text-muted small">Brand Onsite Warranty</span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="tech-assurance-card h-100 d-flex align-items-center gap-3">
              <div className="tech-assurance-icon bg-success-subtle text-success">
                <FaSyncAlt size={18} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark small">Software Pre-Configured</h6>
                <span className="text-muted small">Ready for Attendance/ERP</span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="tech-assurance-card h-100 d-flex align-items-center gap-3">
              <div className="tech-assurance-icon bg-info-subtle text-info">
                <FaTag size={18} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark small">Direct Wholesale Pricing</h6>
                <span className="text-muted small">Up to 35% B2B Discounts</span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="tech-assurance-card h-100 d-flex align-items-center gap-3">
              <div className="tech-assurance-icon bg-warning-subtle text-dark">
                <FaHeadset size={20} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark small">24x7 Tech Support</h6>
                <span className="text-muted small">Hotline: +91 {hotline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Category Sections (As created in Admin Panel) */}
        {loading ? (
          <CustomLoader text="Loading live categories and latest products..." fullPage={false} />
        ) : (
          categories && categories.length > 0 ? (
            categories.map((category) => {
              // Filter products matching this category
              const categoryProducts = products.filter(
                (p) => String(p.category_id) === String(category.category_id)
              );

              return (
                <HorizontalScrollRow
                  key={category.category_id}
                  category={category}
                  products={categoryProducts}
                />
              );
            })
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
              <h5 className="fw-bold text-dark mb-1">No Hardware Categories Added Yet</h5>
              <p className="text-muted small mb-3">Launch the Admin Console to create your first product category.</p>
              <Link to="/admin/categories" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold">
                Go to Category Manager
              </Link>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
