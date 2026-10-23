import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import ProductCard from './ProductCard';
import '../assets/Css/Home.css';

const HorizontalScrollRow = ({ category, products = [] }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Take top 10 latest products
  const latestTenProducts = products.slice(0, 10);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleViewList = () => {
    navigate(`/category/${category.slug || category.category_id}`);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="category-section-container bg-white rounded-3 shadow-sm p-3 mb-3">
      {/* Category Section Header */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold text-dark mb-0 category-heading" style={{ fontSize: '1.15rem' }}>
              {category.category_name}
            </h5>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style={{ fontSize: '0.65rem' }}>
              Top 10 Deals
            </span>
          </div>
          {category.description && (
            <p className="text-muted small mb-0 mt-1 d-none d-md-block" style={{ fontSize: '0.75rem' }}>
              {category.description}
            </p>
          )}
        </div>

        {/* View List Button */}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3 py-1 fw-semibold rounded-pill"
          style={{ fontSize: '0.78rem' }}
          onClick={handleViewList}
        >
          <span>View All</span>
          <FaArrowRight size={10} />
        </button>
      </div>

      {/* Horizontal Scroll Area with Nav Chevrons */}
      <div className="position-relative horizontal-scroll-wrapper">
        <button
          className="scroll-btn scroll-btn-left"
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
        >
          <FaChevronLeft size={16} />
        </button>

        <div className="horizontal-scroll-row" ref={scrollRef}>
          {latestTenProducts.map((product) => (
            <div key={product.product_id} className="horizontal-scroll-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          className="scroll-btn scroll-btn-right"
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
        >
          <FaChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalScrollRow;
