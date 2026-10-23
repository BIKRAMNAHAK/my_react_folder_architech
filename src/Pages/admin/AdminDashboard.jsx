import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../Components/AdminLayout';
import CustomLoader from '../../Components/CustomLoader';
import { getAdminStatsApi, getAllOrdersApi } from '../../Services/Actions/getApis';
import {
  FaTags,
  FaBoxOpen,
  FaShoppingBag,
  FaMoneyBillWave,
  FaMousePointer,
  FaWhatsapp,
  FaArrowRight,
  FaPlus
} from 'react-icons/fa';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.addvotisement);
  const { allOrders } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const fd = new FormData();
      fd.append('action', 'ADMIN_DASHBOARD_STATS');
      await dispatch(getAdminStatsApi(fd));

      const orderFd = new FormData();
      orderFd.append('action', 'GET_ALL_ORDERS');
      await dispatch(getAllOrdersApi(orderFd));

      setLoading(false);
    };

    loadDashboard();
  }, [dispatch]);

  return (
    <AdminLayout pageTitle="Executive Dashboard Overview">
      {/* Header and Quick Action Buttons */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Live Store Analytics & Operations</h4>
          <span className="text-muted small">Monitor categories, hardware catalog, B2B clients, leads CRM, and sales in real time</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/customers" className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm px-3 py-2">
            Clients Directory
          </Link>
          <Link to="/admin/leads" className="btn btn-outline-success btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm px-3 py-2">
            Leads CRM
          </Link>
          <Link to="/admin/products" className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm px-3 py-2">
            <FaPlus size={12} /> Add Product
          </Link>
          <Link to="/admin/categories" className="btn btn-warning btn-sm fw-bold text-dark d-flex align-items-center gap-1 shadow-sm px-3 py-2">
            <FaTags size={12} /> Add Category
          </Link>
        </div>
      </div>

      {loading ? (
        <CustomLoader text="Loading dashboard metrics..." fullPage={false} />
      ) : (
        <>
          {/* Colorful KPI Metrics Cards */}
          <div className="row g-3 mb-4">
            {/* 1. Categories Card - Blue Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-blue">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">Live Categories</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">{stats.total_categories}</h2>
                    <span className="badge bg-white text-primary mt-2 small fw-bold">
                      Dynamic Home Sections
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaTags size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Products Card - Green Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-green">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">Active Products</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">{stats.total_products}</h2>
                    <span className="badge bg-white text-success mt-2 small fw-bold">
                      Hardware In Catalog
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaBoxOpen size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Orders Card - Amber Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-amber">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">Customer Orders</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">{stats.total_orders}</h2>
                    <span className="badge bg-white text-dark mt-2 small fw-bold">
                      Orders Received
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaShoppingBag size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Revenue Card - Cyan Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-cyan">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">Gross Revenue</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">₹{parseFloat(stats.total_revenue || 0).toLocaleString()}</h2>
                    <span className="badge bg-white text-info mt-2 small fw-bold">
                      Total Sales Volume
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaMoneyBillWave size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Ad Visitors Card - Rose Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-rose">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">Client Ad Visitors</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">{stats.total_ad_clicks}</h2>
                    <span className="badge bg-white text-danger mt-2 small fw-bold">
                      External Software Clicks
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaMousePointer size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. WhatsApp Enquiries Card - Purple Gradient */}
            <div className="col-xl-4 col-md-6">
              <div className="kpi-card kpi-card-purple">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-white-50 small fw-bold text-uppercase">WhatsApp Enquiries</span>
                    <h2 className="fw-bold mb-0 mt-1 text-white">{stats.total_ad_enquiries}</h2>
                    <span className="badge bg-white text-dark mt-2 small fw-bold">
                      Direct Leads
                    </span>
                  </div>
                  <div className="kpi-icon-pill">
                    <FaWhatsapp size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="admin-card-table p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Recent Customer Hardware Orders</h5>
                <span className="text-muted small">Latest orders placed with customer information and ad referral tracking</span>
              </div>
              <Link to="/admin/orders" className="btn btn-outline-primary btn-sm fw-semibold">
                View All Orders <FaArrowRight size={11} className="ms-1" />
              </Link>
            </div>

            {allOrders && allOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Amount</th>
                      <th>Campaign Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.slice(0, 5).map((ord) => (
                      <tr key={ord.order_id}>
                        <td className="fw-bold text-primary">#{ord.order_id}</td>
                        <td className="fw-semibold text-dark">{ord.customer_name}</td>
                        <td className="text-secondary small">{ord.customer_phone}</td>
                        <td className="fw-bold text-dark fs-6">₹{parseFloat(ord.final_amount).toLocaleString()}</td>
                        <td>
                          {ord.ad_campaign_name ? (
                            <span className="badge bg-warning text-dark text-truncate d-inline-block" style={{ maxWidth: '180px' }}>
                              {ord.ad_campaign_name}
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted border small">Direct Website Visit</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            ord.order_status === 'delivered' ? 'bg-success' : 'bg-primary'
                          } text-uppercase px-2 py-1`}>
                            {ord.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted small mb-0">No orders received yet.</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
