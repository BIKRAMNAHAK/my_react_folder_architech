import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import CustomButton from '../../Components/CustomButton';
import CustomLoader from '../../Components/CustomLoader';
import { addProductApi, deleteProductApi } from '../../Services/Actions/postApis';
import { getProductsApi, getCategoriesApi } from '../../Services/Actions/getApis';
import {
  FaBoxOpen,
  FaPlus,
  FaTrash,
  FaImages,
  FaCalculator,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa';

const ProductManager = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.products);

  // Modal Visibility State: Default is FALSE (view list table is shown by default)
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter & Search State in Default View
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');

  // Form State
  const [productName, setProductName] = useState('');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [details, setDetails] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('50');

  // File Uploads State
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Multi-select Gallery Images
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  // Real-time live auto discount calculation
  const numMarket = parseFloat(marketPrice) || 0;
  const numSale = parseFloat(salePrice) || 0;
  const autoDiscount = numMarket > numSale && numMarket > 0
    ? Math.round(((numMarket - numSale) / numMarket) * 100)
    : 0;

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    setTableLoading(true);
    const catFd = new FormData();
    catFd.append('action', 'GET_CATEGORIES');
    await dispatch(getCategoriesApi(catFd));

    const prodFd = new FormData();
    prodFd.append('action', 'GET_PRODUCTS');
    await dispatch(getProductsApi(prodFd));
    setTableLoading(false);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(previews);
    }
  };

  const resetForm = () => {
    setProductName('');
    setModel('');
    setCategoryId('');
    setDetails('');
    setMarketPrice('');
    setSalePrice('');
    setCoverImage(null);
    setCoverPreview('');
    setCoverUrl('');
    setGalleryImages([]);
    setGalleryPreviews([]);
  };

  // Add Product Handler matching requested user syntax
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName || !categoryId || !marketPrice || !salePrice) {
      setAlert({ type: 'error', msg: 'Please fill Product Name, Category, Market Price, and Sale Price.' });
      return;
    }

    if (numSale > numMarket) {
      setAlert({ type: 'error', msg: 'Sale price cannot exceed market price (MRP).' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'ADD_PRODUCT');
    formdata.append('product_name', productName.trim());
    formdata.append('model', model.trim());
    formdata.append('category_id', categoryId);
    formdata.append('details', details.trim());
    formdata.append('market_price', numMarket);
    formdata.append('sale_price', numSale);
    formdata.append('discount_percent', autoDiscount);
    formdata.append('stock', stock);

    if (coverImage) {
      formdata.append('cover_image', coverImage);
    } else if (coverUrl) {
      formdata.append('cover_image_url', coverUrl);
    }

    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((imgFile) => {
        formdata.append('gallery_images[]', imgFile);
      });
    }

    dispatch(addProductApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success === true) {
          setAlert({
            type: 'success',
            msg: res.msg || `Product added with ${autoDiscount}% auto-calculated discount!`
          });
          resetForm();
          setShowAddModal(false); // Close modal on success
          loadData();
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Failed to save product' });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Submission error: ' + err.message });
      });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const formdata = new FormData();
      formdata.append('action', 'DELETE_PRODUCT');
      formdata.append('product_id', productId);

      dispatch(deleteProductApi(formdata))
        .then((res) => {
          if (res.success === true) {
            setAlert({ type: 'success', msg: 'Product deleted successfully' });
            loadData();
          } else {
            setAlert({ type: 'error', msg: res.msg });
          }
        })
        .catch((err) => {
          setAlert({ type: 'error', msg: err.message });
        });
    }
  };

  // Filtered products list for default view
  const filteredProducts = (products || []).filter((p) => {
    const matchesSearch =
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilterCategory
      ? String(p.category_id) === String(selectedFilterCategory)
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout pageTitle="Product Catalog & Auto-Discount Manager">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      {/* TOP HEADER BAR WITH SEPARATED ADD BUTTON */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaBoxOpen className="text-primary" />
            <span>Hardware Catalog Products ({products?.length || 0})</span>
          </h4>
          <span className="text-muted small">
            Manage printers, biometric attendance, face recognition, CCTV cameras, and POS devices.
          </span>
        </div>

        {/* Separated Add Button on Top */}
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-3"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <FaPlus size={13} />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* DEFAULT FULL-WIDTH VIEW: PRODUCTS CATALOG TABLE */}
      <div className="admin-card-table p-4 bg-white">
        {/* Table Search & Filter Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 border-bottom pb-3">
          <div className="d-flex flex-column flex-sm-row gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaSearch className="text-muted" size={13} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products by title or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ maxWidth: '240px' }}>
              <span className="input-group-text bg-light border-end-0">
                <FaFilter className="text-muted" size={12} />
              </span>
              <select
                className="form-select border-start-0"
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories && categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small fw-medium">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
            <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
              Refresh
            </button>
          </div>
        </div>

        {tableLoading ? (
          <CustomLoader text="Loading catalog products..." fullPage={false} />
        ) : filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Market (MRP)</th>
                  <th>Sale Price</th>
                  <th>Auto Discount</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const mPrice = parseFloat(p.market_price) || 0;
                  const sPrice = parseFloat(p.sale_price) || 0;
                  const disc = p.discount_percent || (mPrice > sPrice ? Math.round(((mPrice - sPrice) / mPrice) * 100) : 0);

                  return (
                    <tr key={p.product_id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop'}
                            alt={p.product_name}
                            className="rounded border p-1"
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                          />
                          <div>
                            <strong className="text-dark d-block text-truncate" style={{ maxWidth: '280px' }}>
                              {p.product_name}
                            </strong>
                            {p.gallery?.length > 0 && (
                              <span className="badge bg-light text-secondary border small">
                                <FaImages className="me-1" size={10} />
                                {p.gallery.length} Gallery Photos
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-light text-secondary border font-monospace text-uppercase">
                          {p.model || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold">
                          {p.category_name || 'Hardware'}
                        </span>
                      </td>

                      <td>
                        <span className="text-muted text-decoration-line-through">
                          ₹{mPrice.toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <strong className="text-dark fs-6">
                          ₹{sPrice.toLocaleString()}
                        </strong>
                      </td>

                      <td>
                        {disc > 0 ? (
                          <span className="badge bg-success px-2 py-1 fw-bold">
                            {disc}% OFF
                          </span>
                        ) : (
                          <span className="text-muted small">0%</span>
                        )}
                      </td>

                      <td>
                        <span className="badge bg-info-subtle text-info border border-info-subtle">
                          {p.stock || 50} units
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm p-2"
                          title="Delete Product"
                          onClick={() => handleDeleteProduct(p.product_id)}
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No products found matching your search.</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedFilterCategory('');
                setShowAddModal(true);
              }}
            >
              + Add New Product
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SEPARATED ADD PRODUCT MODAL (Opens on Button Click)      */}
      {/* ======================================================== */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        backdrop="static"
        scrollable={true}
        className="admin-modal"
      >
        <div className="admin-modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <FaPlus className="text-warning" size={16} />
            <span>Add New Hardware Product</span>
          </h5>
          <button
            type="button"
            className="btn btn-link text-white p-0"
            onClick={() => setShowAddModal(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        <Modal.Body className="p-4">
          <form onSubmit={handleAddProduct}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Product Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Epson EcoTank L3210 All-in-One Ink Tank Printer"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Model Number / Code *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. L3210-EcoTank, ZK-K40"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              {/* Category Dropdown (Dynamic from database) */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Category (Dropdown) *</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category...</option>
                  {categories && categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Box with Live Auto Discount Calculation */}
            <div className="p-3 bg-light rounded-3 border mb-3">
              <span className="small text-muted fw-bold text-uppercase d-block mb-2">
                <FaCalculator className="me-1 text-primary" size={13} /> Pricing & Live Auto Discount Calculation
              </span>
              <div className="row g-2 align-items-center mb-2">
                <div className="col-4">
                  <label className="form-label small fw-semibold mb-1">Market Price (MRP ₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 16999"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold mb-1">Sale Price (Offer ₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 12999"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    required
                  />
                </div>
                {/* Auto Calculated Discount Display */}
                <div className="col-4 text-center">
                  <label className="form-label small fw-semibold mb-1">Auto Calculated %</label>
                  <div className="p-2 bg-success text-white rounded fw-bold fs-6 shadow-xs">
                    {autoDiscount}% OFF
                  </div>
                </div>
              </div>

              {/* Interactive Discount Range Slider */}
              <div className="mt-2 pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small fw-semibold text-secondary">
                    Set Discount Range via Slider:
                  </span>
                  <span className="badge bg-primary fw-bold">{autoDiscount}% Discount</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="80"
                  step="1"
                  value={autoDiscount}
                  onChange={(e) => {
                    const disc = Number(e.target.value);
                    if (numMarket > 0) {
                      const calculatedSale = Math.round(numMarket * (1 - disc / 100));
                      setSalePrice(calculatedSale);
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                  <span>0% (MRP)</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>80% Max</span>
                </div>
              </div>

              {autoDiscount > 0 && (
                <span className="text-success small fw-medium mt-2 d-block">
                  ✓ Calculated automatically! Ye discount percentage product card badge me show hoga.
                </span>
              )}
            </div>

            {/* Details / Features */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Details / Features (kya kya features milega es product me) *
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Separate features with | (e.g. Print, Scan, Copy | Wireless WiFi | 1 Year Onsite Warranty | Bundled with Attendance Software)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              ></textarea>
              <div className="form-text small">
                Har feature ke beech me vertical pipe (|) symbol use karein Flipkart bullet points layout ke liye.
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Product Cover Image (Primary) *</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
                {coverPreview && (
                  <div className="mt-2 text-center p-2 border rounded bg-white">
                    <img src={coverPreview} alt="Preview" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              {/* Gallery Multi-Select */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                  <FaImages className="text-primary" size={13} />
                  <span>Gallery Images (Multi-select)</span>
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                />
                {galleryPreviews.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2 p-1 border rounded bg-white">
                    {galleryPreviews.map((prev, idx) => (
                      <img key={idx} src={prev} alt="Thumb" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded border" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <CustomButton
                type="submit"
                variant="primary"
                loading={loading}
                icon={<FaPlus />}
                className="px-4 fw-bold"
              >
                Save Product & Publish to Catalog
              </CustomButton>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default ProductManager;
