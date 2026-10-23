import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import {
  FaUsers,
  FaSearch,
  FaWhatsapp,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaRupeeSign,
  FaEye,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaUserTie
} from 'react-icons/fa';

const CustomerManager = () => {
  // Demo Initial Clients List tailored for B2B IT Hardware & Software
  const [customers, setCustomers] = useState([
    {
      id: 101,
      name: 'Rajesh Mohanty',
      company: 'Apex Logistics & Warehousing',
      phone: '9861012345',
      email: 'rajesh@apexlogistics.in',
      city: 'Bhubaneswar',
      state: 'Odisha',
      gstin: '21AAACA1234F1Z1',
      totalOrders: 4,
      totalSpent: 89500,
      recentProduct: 'Biometric Attendance Machine (ZK-K40) + Software',
      joinedDate: '12 Jan 2026',
      status: 'Verified Corporate'
    },
    {
      id: 102,
      name: 'Sunita Tripathy',
      company: 'Kalinga Public School',
      phone: '9437098765',
      email: 'admin@kalingaschool.edu.in',
      city: 'Cuttack',
      state: 'Odisha',
      gstin: '21AABTK9876M1Z4',
      totalOrders: 6,
      totalSpent: 142000,
      recentProduct: 'AI Face Attendance Terminal + Cloud School ERP',
      joinedDate: '28 Dec 2025',
      status: 'Verified Corporate'
    },
    {
      id: 103,
      name: 'Amit Kumar Sahoo',
      company: 'Metro Diagnostic Center',
      phone: '9937044321',
      email: 'amit@metrodiagnostics.com',
      city: 'Rourkela',
      state: 'Odisha',
      gstin: '21AABFM5543D1Z9',
      totalOrders: 2,
      totalSpent: 36800,
      recentProduct: 'Epson EcoTank L3210 Heavy Duty Printer',
      joinedDate: '04 Feb 2026',
      status: 'Active Client'
    },
    {
      id: 104,
      name: 'Bikash Das',
      company: 'Shree Balaji Retail Supermart',
      phone: '9124087654',
      email: 'billing@shreebalajimart.com',
      city: 'Berhampur',
      state: 'Odisha',
      gstin: '21AACCS3321A1Z2',
      totalOrders: 3,
      totalSpent: 52400,
      recentProduct: 'High-Speed 2D Barcode Scanner & POS Printer',
      joinedDate: '18 Feb 2026',
      status: 'Active Client'
    },
    {
      id: 105,
      name: 'Priyanka Senapati',
      company: 'Utkal Pharma Labs',
      phone: '9777123987',
      email: 'info@utkalpharma.in',
      city: 'Sambalpur',
      state: 'Odisha',
      gstin: '21AAGPU7765Q1Z7',
      totalOrders: 5,
      totalSpent: 118900,
      recentProduct: '8-Channel 4K CCTV Security System + NVR',
      joinedDate: '10 Nov 2025',
      status: 'Verified Corporate'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  // Add Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    state: 'Odisha',
    gstin: ''
  });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      setAlert({ type: 'error', msg: 'Name and Phone Number are required.' });
      return;
    }

    const created = {
      id: Date.now(),
      name: newClient.name,
      company: newClient.company || 'Direct Client',
      phone: newClient.phone,
      email: newClient.email || 'N/A',
      city: newClient.city || 'Bhubaneswar',
      state: newClient.state || 'Odisha',
      gstin: newClient.gstin || 'Unregistered',
      totalOrders: 0,
      totalSpent: 0,
      recentProduct: 'None yet',
      joinedDate: 'Today',
      status: newClient.gstin ? 'Verified Corporate' : 'Active Client'
    };

    setCustomers([created, ...customers]);
    setShowAddModal(false);
    setAlert({ type: 'success', msg: `Client "${created.name}" registered successfully.` });
    setNewClient({ name: '', company: '', phone: '', email: '', city: '', state: 'Odisha', gstin: '' });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <AdminLayout pageTitle="Client & Customer Directory">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      {/* Top Header & Add Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaUsers className="text-primary" />
            <span>Corporate Clients & Customer Directory ({customers.length})</span>
          </h4>
          <span className="text-muted small">
            Manage your B2B institutional buyers, schools, warehouses, retail shops, and clinic accounts.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-3"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus size={13} />
          <span>+ Add Corporate Client</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-blue">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Total Clients</span>
                <h3 className="fw-bold my-1">{customers.length}</h3>
                <span className="small text-white-50">Active in Odisha Region</span>
              </div>
              <div className="kpi-icon-pill">
                <FaUsers size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-green">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Verified Corporates</span>
                <h3 className="fw-bold my-1">{customers.filter((c) => c.status.includes('Corporate')).length}</h3>
                <span className="small text-white-50">GST Registered Accounts</span>
              </div>
              <div className="kpi-icon-pill">
                <FaBuilding size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-purple">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Client Revenue</span>
                <h3 className="fw-bold my-1">₹{totalRevenue.toLocaleString()}</h3>
                <span className="small text-white-50">Hardware & AMC Invoiced</span>
              </div>
              <div className="kpi-icon-pill">
                <FaRupeeSign size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-amber">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">WhatsApp Direct</span>
                <h3 className="fw-bold my-1">100% Ready</h3>
                <span className="small text-white-50">Instant 1-Click Connect</span>
              </div>
              <div className="kpi-icon-pill">
                <FaWhatsapp size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Clients Table Card */}
      <div className="admin-card-table p-4 bg-white">
        {/* Search Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 border-bottom pb-3">
          <div className="input-group" style={{ maxWidth: '480px' }}>
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" size={13} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by client name, business/company, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <span className="text-muted small fw-medium">
            Showing <strong>{filteredCustomers.length}</strong> client records
          </span>
        </div>

        {/* Clients Table (Horizontal Scroll Isolated) */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Client / Contact</th>
                <th>Company / Enterprise</th>
                <th>City & Region</th>
                <th>Orders</th>
                <th>Lifetime Spend</th>
                <th>Account Status</th>
                <th>Connect & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((client) => {
                const whatsappUrl = `https://wa.me/91${client.phone}?text=${encodeURIComponent(
                  `Hello ${client.name}, this is TECHNO MATRIX IT & Hardware Solutions. We are following up regarding your hardware support and software integration.`
                )}`;

                return (
                  <tr key={client.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}>
                          {client.name.charAt(0)}
                        </span>
                        <div>
                          <strong className="text-dark d-block">{client.name}</strong>
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <FaPhoneAlt size={10} /> +91 {client.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="fw-semibold text-dark d-block">{client.company}</span>
                      {client.gstin && (
                        <span className="badge bg-light text-secondary border font-monospace small">
                          GST: {client.gstin}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="text-dark small d-flex align-items-center gap-1">
                        <FaMapMarkerAlt size={11} className="text-danger" /> {client.city}, {client.state}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-info-subtle text-info border border-info-subtle">
                        {client.totalOrders} Hardware Orders
                      </span>
                    </td>

                    <td>
                      <strong className="text-success fs-6">
                        ₹{client.totalSpent.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span className={`badge ${client.status.includes('Corporate') ? 'bg-success' : 'bg-primary'}`}>
                        {client.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {/* Direct WhatsApp Contact Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1 fw-bold"
                          title="Open WhatsApp Chat"
                        >
                          <FaWhatsapp size={14} /> WhatsApp
                        </a>

                        {/* View Full Profile Modal Button */}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm p-1 px-2 rounded-circle"
                          title="View Details"
                          onClick={() => {
                            setSelectedCustomer(client);
                            setShowDetailModal(true);
                          }}
                        >
                          <FaEye size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLIENT DETAILS MODAL */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered className="admin-modal">
        {selectedCustomer && (
          <>
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <FaUserTie className="text-info" />
                <span>Client Profile: {selectedCustomer.name}</span>
              </h5>
              <button
                type="button"
                className="btn btn-link text-white p-0"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimes size={18} />
              </button>
            </div>
            <Modal.Body className="p-4">
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="row g-2">
                  <div className="col-6">
                    <span className="small text-muted d-block">Company Name</span>
                    <strong className="text-dark">{selectedCustomer.company}</strong>
                  </div>
                  <div className="col-6">
                    <span className="small text-muted d-block">GSTIN Number</span>
                    <span className="font-monospace text-primary">{selectedCustomer.gstin}</span>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="small text-muted d-block">Phone Number</span>
                    <strong className="text-dark">+91 {selectedCustomer.phone}</strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="small text-muted d-block">Email Address</span>
                    <strong className="text-dark">{selectedCustomer.email}</strong>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <span className="small text-muted d-block mb-1">Recent Hardware Purchase</span>
                <div className="p-2 border rounded bg-white small text-secondary">
                  <FaCheckCircle className="text-success me-1" /> {selectedCustomer.recentProduct}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <div>
                  <span className="small text-muted d-block">Lifetime Account Billing</span>
                  <span className="fs-5 fw-bold text-success">₹{selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <a
                  href={`https://wa.me/91${selectedCustomer.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success d-inline-flex align-items-center gap-2 px-3 fw-bold rounded-pill"
                >
                  <FaWhatsapp size={16} /> Connect on WhatsApp
                </a>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* ADD NEW CLIENT MODAL */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="admin-modal">
        <div className="admin-modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <FaPlus className="text-warning" />
            <span>Register New B2B Client</span>
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
          <form onSubmit={handleAddClient}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Client / Contact Person Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ramesh Chandra Das"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Company / Firm / School / Store Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Utkal Technologies Pvt Ltd"
                value={newClient.company}
                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 9861000000"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bhubaneswar"
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">GSTIN (Optional)</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  placeholder="e.g. 21AAAAA0000A1Z5"
                  value={newClient.gstin}
                  onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                />
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
              <button type="submit" className="btn btn-primary px-4 fw-bold">
                Save & Register Client
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default CustomerManager;
