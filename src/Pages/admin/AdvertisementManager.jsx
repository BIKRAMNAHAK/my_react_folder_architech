import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import CustomButton from '../../Components/CustomButton';
import CustomLoader from '../../Components/CustomLoader';
import { createAdvertisementApi } from '../../Services/Actions/postApis';
import { getAdvertisementsApi, getProductsApi } from '../../Services/Actions/getApis';
import AdBannerWidget from '../user/AdBannerWidget';
import {
  FaBullhorn,
  FaPlus,
  FaCopy,
  FaMousePointer,
  FaWhatsapp,
  FaShoppingBag,
  FaLink,
  FaCheck,
  FaCode,
  FaExternalLinkAlt,
  FaTimes
} from 'react-icons/fa';

const AdvertisementManager = () => {
  const dispatch = useDispatch();
  const { advertisements } = useSelector((state) => state.addvotisement);
  const { products } = useSelector((state) => state.products);

  // Modal Visibility State: Default is FALSE (view list table is shown by default)
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [productId, setProductId] = useState('');
  const [tagline, setTagline] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [discountBadge, setDiscountBadge] = useState('30% OFF SPECIAL OFFER');
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [bannerUrl, setBannerUrl] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [copiedWidget, setCopiedWidget] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    setTableLoading(true);
    const adFd = new FormData();
    adFd.append('action', 'GET_ADVERTISEMENTS');
    await dispatch(getAdvertisementsApi(adFd));

    const prodFd = new FormData();
    prodFd.append('action', 'GET_PRODUCTS');
    await dispatch(getProductsApi(prodFd));
    setTableLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setProductId('');
    setTagline('');
    setOfferPrice('');
    setBannerUrl('');
  };

  const handleCreateAd = (e) => {
    e.preventDefault();
    if (!title || !productId || !offerPrice) {
      setAlert({ type: 'error', msg: 'Please provide Title, Linked Product, and Special Offer Price.' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'CREATE_ADVERTISEMENT');
    formdata.append('title', title.trim());
    formdata.append('product_id', productId);
    formdata.append('tagline', tagline.trim());
    formdata.append('offer_price', offerPrice);
    formdata.append('discount_badge', discountBadge.trim());
    formdata.append('whatsapp_number', whatsappNumber.trim());
    formdata.append('banner_image_url', bannerUrl.trim());

    dispatch(createAdvertisementApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success === true) {
          setAlert({
            type: 'success',
            msg: res.msg || 'Advertisement campaign created! Shareable link generated for client websites.'
          });
          resetForm();
          setShowAddModal(false); // Close modal on success
          loadData();
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Failed to create campaign' });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Creation failed: ' + err.message });
      });
  };

  const copyIframeCode = () => {
    const iframeCode = `<iframe src="${window.location.origin}/ad-banner" width="100%" height="220" style="border:none; border-radius:12px; overflow:hidden;" title="Hardware Special Deals"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopiedWidget(true);
    setTimeout(() => setCopiedWidget(false), 2500);
  };

  const copyShareableLink = (adId) => {
    const fullUrl = `${window.location.origin}/offer/${adId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(adId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <AdminLayout pageTitle="Client Website Ad Campaigns & Links">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      {/* TOP HEADER BAR WITH SEPARATED ADD BUTTON */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaBullhorn className="text-warning" />
            <span>Client Website Ad Campaigns & Tracking</span>
          </h4>
          <span className="text-muted small">
            Promotional offers for client websites with WhatsApp inquiry tracking, visit clicks, and order attribution.
          </span>
        </div>

        {/* Separated Add Button on Top */}
        <button
          type="button"
          className="btn btn-warning text-dark d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-3"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <FaPlus size={13} />
          <span>+ Create New Campaign Link</span>
        </button>
      </div>

      {/* EMBEDDABLE CAROUSEL BANNER SECTION */}
      <div className="admin-card-table p-4 bg-white mb-4 border-top border-4 border-warning">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <span className="badge bg-warning text-dark px-2 py-1 mb-1 fw-bold">
              <FaBullhorn className="me-1" /> CLIENT WEBSITE BANNER CAROUSEL
            </span>
            <h5 className="fw-bold text-dark mb-0">Live Rotating Carousel Banner Widget</h5>
            <p className="text-muted small mb-0">
              Ye Carousel banner aapke sabhi client websites / software ke liye ready hai. Website ki length ke according ye responsive chalta hai aur click karne par user direct offer page par redirect ho jata hai!
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm"
              onClick={copyIframeCode}
            >
              {copiedWidget ? (
                <>
                  <FaCheck className="text-warning" /> Copied Embed Code!
                </>
              ) : (
                <>
                  <FaCode /> Copy iFrame Embed Code
                </>
              )}
            </button>
            <a
              href="/ad-banner"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 px-3 py-2"
            >
              <FaExternalLinkAlt size={12} /> Open Banner Tab
            </a>
          </div>
        </div>

        {/* Live Carousel Banner Preview */}
        <div className="p-2 bg-light rounded-3 border">
          <span className="text-muted small fw-semibold text-uppercase d-block mb-2">
            Live Banner Preview (Clicking any slide redirects to its offer page):
          </span>
          <AdBannerWidget />
        </div>
      </div>

      {/* DEFAULT FULL-WIDTH VIEW: CAMPAIGNS LIST TABLE */}
      <div className="admin-card-table p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <h5 className="fw-bold text-dark mb-0">
            Active Campaigns & Real-Time Tracking ({advertisements?.length || 0})
          </h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
            Refresh
          </button>
        </div>

        {tableLoading ? (
          <CustomLoader text="Loading campaigns..." fullPage={false} />
        ) : advertisements && advertisements.length > 0 ? (
          <div className="row g-3">
            {advertisements.map((ad) => (
              <div key={ad.ad_id} className="col-lg-6">
                <div className="card border rounded-3 p-3 bg-light shadow-none h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-danger mb-1 small">
                          {ad.discount_badge || 'SPECIAL OFFER'}
                        </span>
                        <h6 className="fw-bold text-dark mb-1">{ad.title}</h6>
                        <span className="text-secondary small">
                          Linked Product: <strong>{ad.product_name}</strong>
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="fs-5 fw-bold text-primary">
                          ₹{parseFloat(ad.offer_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Live Analytics Badges */}
                    <div className="d-flex flex-wrap gap-2 my-2 pt-2 border-top">
                      <span className="badge bg-white text-dark border d-flex align-items-center gap-1 p-2">
                        <FaMousePointer className="text-danger" size={11} />
                        <span>Clicks: <strong>{ad.clicks_count || 0}</strong></span>
                      </span>

                      <span className="badge bg-white text-dark border d-flex align-items-center gap-1 p-2">
                        <FaWhatsapp className="text-success" size={12} />
                        <span>Enquiries: <strong>{ad.inquiries_count || 0}</strong></span>
                      </span>

                      <span className="badge bg-white text-dark border d-flex align-items-center gap-1 p-2">
                        <FaShoppingBag className="text-primary" size={11} />
                        <span>Purchases: <strong>{ad.conversions_count || 0}</strong></span>
                      </span>
                    </div>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="mt-3 pt-2 border-top d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
                    <div className="small font-monospace text-truncate text-muted" style={{ maxWidth: '280px' }}>
                      <FaLink className="me-1 text-primary" />
                      {window.location.origin}/offer/{ad.ad_id}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => copyShareableLink(ad.ad_id)}
                      >
                        {copiedId === ad.ad_id ? (
                          <>
                            <FaCheck className="text-success" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy Link
                          </>
                        )}
                      </button>
                      <a
                        href={`/offer/${ad.ad_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No advertisement campaigns created yet.</p>
            <button
              className="btn btn-warning fw-bold text-dark btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              + Create Your First Campaign
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SEPARATED CREATE CAMPAIGN MODAL (Opens on Button Click)  */}
      {/* ======================================================== */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        backdrop="static"
        className="admin-modal"
      >
        <div className="admin-modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <FaPlus className="text-warning" size={16} />
            <span>Create Client Campaign Link</span>
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
          <form onSubmit={handleCreateAd}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Campaign Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Minup AI Face Attendance - Special Corporate Offer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Linked Hardware Product *</label>
              <select
                className="form-select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Select Hardware Product...</option>
                {products && products.map((prod) => (
                  <option key={prod.product_id} value={prod.product_id}>
                    {prod.product_name} (Regular Price: ₹{parseFloat(prod.sale_price).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Campaign Tagline / Subtitle</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Automate staff attendance with AI Face scanner. Zero touch!"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Special Offer Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="9999"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  required
                />
              </div>

              <div className="col-6">
                <label className="form-label small fw-semibold">Discount Badge Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="33% OFF FLASH DEAL"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">WhatsApp Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="919876543210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
              <div className="form-text small">
                Client website par "Enquire Now" dabane par is number par WhatsApp khulega.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Banner Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
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
                variant="warning"
                loading={loading}
                icon={<FaPlus />}
                className="px-4 fw-bold text-dark"
              >
                Generate Campaign Link
              </CustomButton>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default AdvertisementManager;
