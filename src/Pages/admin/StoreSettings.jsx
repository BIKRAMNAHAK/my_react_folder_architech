import React, { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import {
  FaCog,
  FaBuilding,
  FaFileInvoiceDollar,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaQrcode,
  FaBullhorn,
  FaSave,
  FaCheck,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

const StoreSettings = () => {
  // Load saved settings or fallback to initial defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('techno_matrix_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      storeName: 'TECHNO MATRIX IT & Hardware Solutions',
      tagline: 'Enterprise Hardware & Smart ERP Software Suite',
      gstin: '21AAACA9876F1Z8',
      whatsappHotline: '9861012345',
      supportEmail: 'support@technomatrix.com',
      serviceAddress: 'Plot 412, Saheed Nagar, Janpath, Bhubaneswar, Odisha - 751007',
      upiId: 'technomatrix@icici',
      announcementBar: '⚡ Special Corporate Offer: Free On-site Biometric Setup & 1-Year Cloud Software on all hardware orders!',
      announcementActive: true,
      codEnabled: true,
      whatsappOrdering: true,
      maintenanceMode: false
    };
  });

  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('techno_matrix_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setAlert({ type: 'success', msg: 'Enterprise settings updated and applied successfully!' });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AdminLayout pageTitle="Enterprise Store & Billing Settings">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaCog className="text-primary" />
            <span>Store Profile, GSTIN & WhatsApp Hotline</span>
          </h4>
          <span className="text-muted small">
            Configure business legal details, WhatsApp hotline number, UPI billing, and customer announcements.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-3"
          onClick={handleSave}
        >
          <FaSave size={14} />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* Left Column: Business & GST Identity */}
          <div className="col-lg-7">
            {/* Business Info Card */}
            <div className="admin-card-table p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                <FaBuilding className="text-primary" size={16} />
                <span>Business & Legal Invoicing Identity</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Legal Enterprise / Firm Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">GSTIN Tax Number (For B2B Invoices) *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaFileInvoiceDollar className="text-primary" size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control font-monospace fw-bold"
                      value={settings.gstin}
                      onChange={(e) => handleChange('gstin', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Store Tagline / Slogan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">WhatsApp Customer Hotline *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-success fw-bold">+91</span>
                    <input
                      type="tel"
                      className="form-control fw-bold"
                      value={settings.whatsappHotline}
                      onChange={(e) => handleChange('whatsappHotline', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-text small">Used for instant customer quotes and order confirmations.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Support Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaEnvelope className="text-muted" size={14} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label small fw-semibold">Service Center & Warehouse Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaMapMarkerAlt className="text-danger" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.serviceAddress}
                    onChange={(e) => handleChange('serviceAddress', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Live Store Announcement Banner Card */}
            <div className="admin-card-table p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                <FaBullhorn className="text-warning" size={16} />
                <span>Store Announcement & Top Notice Bar</span>
              </h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="announcementSwitch"
                  checked={settings.announcementActive}
                  onChange={(e) => handleChange('announcementActive', e.target.checked)}
                />
                <label className="form-check-label small fw-semibold" htmlFor="announcementSwitch">
                  Enable Live Top Announcement Bar across Storefront
                </label>
              </div>

              <div className="mb-0">
                <label className="form-label small fw-semibold">Announcement Text</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={settings.announcementBar}
                  onChange={(e) => handleChange('announcementBar', e.target.value)}
                  disabled={!settings.announcementActive}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Features Toggles */}
          <div className="col-lg-5">
            {/* UPI & Payment Settings */}
            <div className="admin-card-table p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                <FaQrcode className="text-info" size={16} />
                <span>UPI ID & Direct QR Billing</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Business UPI ID (Google Pay / PhonePe / Paytm)</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={settings.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                />
              </div>

              <div className="p-3 bg-light rounded-3 text-center border">
                <span className="small text-muted d-block mb-2">Live UPI QR Code for Storefront</span>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=${encodeURIComponent(
                    settings.upiId
                  )}&pn=${encodeURIComponent(settings.storeName)}`}
                  alt="UPI QR Code"
                  className="img-fluid border p-2 bg-white rounded shadow-xs"
                  style={{ width: '130px', height: '130px' }}
                />
                <span className="small text-secondary d-block mt-2 font-monospace">{settings.upiId}</span>
              </div>
            </div>

            {/* Operational Switches */}
            <div className="admin-card-table p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">
                Operational Store Switches
              </h5>

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong className="text-dark d-block small">Cash on Delivery (COD)</strong>
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Allow customers to pay upon hardware arrival.
                  </span>
                </div>
                <div className="form-check form-switch fs-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => handleChange('codEnabled', e.target.checked)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong className="text-dark d-block small">Direct WhatsApp Inquiries</strong>
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Show "Enquire on WhatsApp" on every hardware page.
                  </span>
                </div>
                <div className="form-check form-switch fs-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.whatsappOrdering}
                    onChange={(e) => handleChange('whatsappOrdering', e.target.checked)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <strong className="text-danger d-block small">Store Maintenance Mode</strong>
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Temporarily pause public checkout for catalog updates.
                  </span>
                </div>
                <div className="form-check form-switch fs-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  />
                </div>
              </div>

              <div className="mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
                >
                  <FaSave size={15} /> Save All Business Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default StoreSettings;
