import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import {
  FaUserTie,
  FaSearch,
  FaFilter,
  FaPlus,
  FaWhatsapp,
  FaPhoneAlt,
  FaBullhorn,
  FaTimes,
  FaTrash,
  FaExchangeAlt,
  FaCheckCircle,
  FaClock,
  FaMicrochip
} from 'react-icons/fa';

const LeadManager = () => {
  // Demo Initial Leads tailored for IT Hardware + Software sales
  const [leads, setLeads] = useState([
    {
      id: 'LD-4091',
      clientName: 'Pradeep Jena',
      company: 'Utkal Steel Fabricators',
      phone: '9861234567',
      email: 'pradeep@utkalsteel.com',
      hardwareNeeded: '6x Biometric Thumb Attendance Machines with Software',
      source: 'Banner Ad Campaign #1',
      status: 'Quotation Sent',
      estimatedBudget: 45000,
      date: '2026-03-01',
      notes: 'Wants cloud sync with payroll ERP software.'
    },
    {
      id: 'LD-4092',
      clientName: 'Dr. Smruti Rekha',
      company: 'Aayush Multispecialty Hospital',
      phone: '9437112233',
      email: 'smruti@aayushhospital.org',
      hardwareNeeded: 'AI Face Recognition Attendance + Thermal Scanner',
      source: 'Website Product Page',
      status: 'Demo Scheduled',
      estimatedBudget: 62000,
      date: '2026-03-02',
      notes: 'Demo required on Monday at hospital reception.'
    },
    {
      id: 'LD-4093',
      clientName: 'Manoj Patra',
      company: 'Smart Bazaar Retail',
      phone: '9937887766',
      email: 'manoj@smartbazaar.in',
      hardwareNeeded: '3x High Speed Barcode Scanners & POS Thermal Printers',
      source: 'WhatsApp Referral',
      status: 'New Lead',
      estimatedBudget: 28000,
      date: '2026-03-03',
      notes: 'Urgent setup needed before weekend rush.'
    },
    {
      id: 'LD-4094',
      clientName: 'Subhasish Nayak',
      company: 'Nayak Educational Trust',
      phone: '9124556677',
      email: 'subhasish@nayakedu.in',
      hardwareNeeded: '16x 4K CCTV Cameras + 2x 8-Port PoE Switch + NVR',
      source: 'Banner Ad Campaign #2',
      status: 'Converted',
      estimatedBudget: 95000,
      date: '2026-02-27',
      notes: 'Order confirmed and advance invoice generated.'
    },
    {
      id: 'LD-4095',
      clientName: 'Tanmay Das',
      company: 'Khurda Cold Storage',
      phone: '9777890123',
      email: 'tanmay@khurdacold.com',
      hardwareNeeded: 'Epson EcoTank Heavy Duty Printer + AMC',
      source: 'Direct Call',
      status: 'New Lead',
      estimatedBudget: 18500,
      date: '2026-03-03',
      notes: 'Inquired for lowest price quotation.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  // Add Lead Form State
  const [newLead, setNewLead] = useState({
    clientName: '',
    company: '',
    phone: '',
    email: '',
    hardwareNeeded: '',
    source: 'Banner Ad Campaign',
    status: 'New Lead',
    estimatedBudget: '',
    notes: ''
  });

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(
      leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    );
    setAlert({ type: 'success', msg: `Lead ${leadId} status updated to "${newStatus}"` });
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm(`Delete lead ${leadId}?`)) {
      setLeads(leads.filter((l) => l.id !== leadId));
      setAlert({ type: 'success', msg: `Lead ${leadId} removed.` });
    }
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.clientName || !newLead.phone || !newLead.hardwareNeeded) {
      setAlert({ type: 'error', msg: 'Please provide Client Name, Phone, and Hardware Needed.' });
      return;
    }

    const created = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newLead.clientName,
      company: newLead.company || 'Individual Client',
      phone: newLead.phone,
      email: newLead.email || 'N/A',
      hardwareNeeded: newLead.hardwareNeeded,
      source: newLead.source,
      status: newLead.status,
      estimatedBudget: parseFloat(newLead.estimatedBudget) || 0,
      date: new Date().toISOString().split('T')[0],
      notes: newLead.notes || 'None'
    };

    setLeads([created, ...leads]);
    setShowAddModal(false);
    setAlert({ type: 'success', msg: `New lead created: ${created.id}` });
    setNewLead({
      clientName: '',
      company: '',
      phone: '',
      email: '',
      hardwareNeeded: '',
      source: 'Banner Ad Campaign',
      status: 'New Lead',
      estimatedBudget: '',
      notes: ''
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.hardwareNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = leads.filter((l) => l.status === 'New Lead').length;
  const inPipelineCount = leads.filter((l) => l.status === 'Demo Scheduled' || l.status === 'Quotation Sent').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;

  return (
    <AdminLayout pageTitle="Leads & Inquiries CRM">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      {/* Top Header & Add Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaUserTie className="text-primary" />
            <span>Hardware Leads & Client Inquiries ({leads.length})</span>
          </h4>
          <span className="text-muted small">
            Track inquiries received from online ad banners, website product pages, and WhatsApp quotes.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-3"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus size={13} />
          <span>+ Add New Lead</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-blue">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Total Inquiries</span>
                <h3 className="fw-bold my-1">{leads.length}</h3>
                <span className="small text-white-50">Active Sales Pipeline</span>
              </div>
              <div className="kpi-icon-pill">
                <FaBullhorn size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-amber">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">New & Uncontacted</span>
                <h3 className="fw-bold my-1">{newCount}</h3>
                <span className="small text-white-50">Requires Callback</span>
              </div>
              <div className="kpi-icon-pill">
                <FaClock size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-purple">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Demo & Quotations</span>
                <h3 className="fw-bold my-1">{inPipelineCount}</h3>
                <span className="small text-white-50">In Progress</span>
              </div>
              <div className="kpi-icon-pill">
                <FaExchangeAlt size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="kpi-card kpi-card-green">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-uppercase opacity-75 fw-bold">Converted to Orders</span>
                <h3 className="fw-bold my-1">{convertedCount}</h3>
                <span className="small text-white-50">Completed Deals</span>
              </div>
              <div className="kpi-icon-pill">
                <FaCheckCircle size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Table Card */}
      <div className="admin-card-table p-4 bg-white">
        {/* Filters */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 border-bottom pb-3">
          <div className="d-flex flex-column flex-sm-row gap-2 flex-grow-1" style={{ maxWidth: '650px' }}>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaSearch className="text-muted" size={13} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search leads by client, company, or hardware..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ maxWidth: '220px' }}>
              <span className="input-group-text bg-light border-end-0">
                <FaFilter className="text-muted" size={12} />
              </span>
              <select
                className="form-select border-start-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="New Lead">New Lead</option>
                <option value="Demo Scheduled">Demo Scheduled</option>
                <option value="Quotation Sent">Quotation Sent</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed / Lost</option>
              </select>
            </div>
          </div>

          <span className="text-muted small fw-medium">
            Showing <strong>{filteredLeads.length}</strong> inquiries
          </span>
        </div>

        {/* CRM Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Lead ID & Date</th>
                <th>Client & Company</th>
                <th>Hardware Inquired</th>
                <th>Source</th>
                <th>Est. Value</th>
                <th>Pipeline Status</th>
                <th>Direct Quote & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const quoteText = encodeURIComponent(
                  `Hello ${lead.clientName}, TECHNO MATRIX IT & Hardware Solutions here. Regarding your requirement for "${lead.hardwareNeeded}", we have prepared your special price quotation. When is a good time for a brief demo?`
                );

                return (
                  <tr key={lead.id}>
                    <td>
                      <span className="font-monospace fw-bold text-dark d-block">{lead.id}</span>
                      <span className="text-muted small">{lead.date}</span>
                    </td>

                    <td>
                      <strong className="text-dark d-block">{lead.clientName}</strong>
                      <span className="text-muted small d-block">{lead.company}</span>
                      <span className="text-primary small d-flex align-items-center gap-1">
                        <FaPhoneAlt size={10} /> +91 {lead.phone}
                      </span>
                    </td>

                    <td>
                      <span className="fw-semibold text-dark d-block" style={{ maxWidth: '240px' }}>
                        {lead.hardwareNeeded}
                      </span>
                      {lead.notes && (
                        <span className="text-muted small d-block text-truncate" style={{ maxWidth: '240px' }}>
                          Note: {lead.notes}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="badge bg-light text-secondary border small">
                        {lead.source}
                      </span>
                    </td>

                    <td>
                      <strong className="text-dark">
                        ₹{lead.estimatedBudget.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <select
                        className={`form-select form-select-sm fw-bold ${
                          lead.status === 'Converted'
                            ? 'text-success border-success'
                            : lead.status === 'New Lead'
                            ? 'text-danger border-danger'
                            : 'text-primary border-primary'
                        }`}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        style={{ width: '150px' }}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Demo Scheduled">Demo Scheduled</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <a
                          href={`https://wa.me/91${lead.phone}?text=${quoteText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1 fw-bold"
                          title="Send Quotation on WhatsApp"
                        >
                          <FaWhatsapp size={14} /> Send Quote
                        </a>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm p-1 px-2 rounded"
                          title="Delete Lead"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <FaTrash size={12} />
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

      {/* ADD LEAD MODAL */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="admin-modal">
        <div className="admin-modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <FaPlus className="text-warning" />
            <span>Create New Hardware Lead</span>
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
          <form onSubmit={handleAddLead}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Client / Inquiry Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ashok Tripathy"
                value={newLead.clientName}
                onChange={(e) => setNewLead({ ...newLead, clientName: e.target.value })}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Company / Firm Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alpha Infotech"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">WhatsApp Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 9861000000"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Hardware Requirement / Specifications *</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. 5x Biometric Attendance Devices with Wi-Fi + Attendance Software Demo"
                value={newLead.hardwareNeeded}
                onChange={(e) => setNewLead({ ...newLead, hardwareNeeded: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Inquiry Source</label>
                <select
                  className="form-select"
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                >
                  <option value="Banner Ad Campaign">Banner Ad Campaign</option>
                  <option value="Website Product Page">Website Product Page</option>
                  <option value="WhatsApp Referral">WhatsApp Referral</option>
                  <option value="Direct Call">Direct Call</option>
                  <option value="Exhibition / Expo">Exhibition / Expo</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Estimated Budget (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 35000"
                  value={newLead.estimatedBudget}
                  onChange={(e) => setNewLead({ ...newLead, estimatedBudget: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Notes / Special Client Demands</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Needs GST invoice and 2-year warranty quote"
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
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
              <button type="submit" className="btn btn-primary px-4 fw-bold">
                Save & Track Lead
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default LeadManager;
