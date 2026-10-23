import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import CustomLoader from '../../Components/CustomLoader';
import { getAllOrdersApi } from '../../Services/Actions/getApis';
import { updateOrderStatusApi } from '../../Services/Actions/postApis';
import { FaShoppingBag, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaBullhorn, FaBoxOpen } from 'react-icons/fa';

const OrderManager = () => {
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  useEffect(() => {
    loadOrders();
  }, [dispatch]);

  const loadOrders = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append('action', 'GET_ALL_ORDERS');
    await dispatch(getAllOrdersApi(fd));
    setLoading(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const fd = new FormData();
    fd.append('action', 'UPDATE_ORDER_STATUS');
    fd.append('order_id', orderId);
    fd.append('order_status', newStatus);

    dispatch(updateOrderStatusApi(fd)).then((res) => {
      if (res.success === true) {
        setAlert({ type: 'success', msg: `Order #${orderId} updated to ${newStatus}` });
        loadOrders();
      } else {
        setAlert({ type: 'error', msg: res.msg });
      }
    });
  };

  return (
    <AdminLayout pageTitle="Orders & Client Referral Tracking">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0">Customer Hardware Orders ({allOrders?.length || 0})</h5>
            <span className="text-muted small">
              Every purchase includes customer contact, delivery address, items, and the client ad campaign source.
            </span>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={loadOrders}>
            Refresh Orders
          </button>
        </div>

        {loading ? (
          <CustomLoader text="Loading orders from database..." fullPage={false} />
        ) : allOrders && allOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Delivery Address</th>
                  <th>Ordered Items</th>
                  <th>Amount</th>
                  <th>Ad Campaign Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((ord) => (
                  <tr key={ord.order_id}>
                    <td>
                      <strong className="text-primary small">#{ord.order_id}</strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Today'}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark small d-flex align-items-center gap-1">
                          <FaUser size={10} className="text-muted" /> {ord.customer_name}
                        </span>
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <FaPhoneAlt size={9} className="text-muted" /> {ord.customer_phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-start gap-1" style={{ maxWidth: '230px' }}>
                        <FaMapMarkerAlt size={11} className="text-danger mt-1 flex-shrink-0" />
                        <span className="small text-secondary">{ord.delivery_address}</span>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-1" style={{ maxWidth: '200px' }}>
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.map((it, idx) => (
                            <div key={idx} className="small text-dark border-bottom pb-1" style={{ fontSize: '0.78rem' }}>
                              <strong>{it.quantity}x</strong> {it.product_name}
                              {it.model && <span className="text-muted font-monospace small ms-1">({it.model})</span>}
                            </div>
                          ))
                        ) : (
                          <span className="small text-muted">Hardware items</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong className="text-dark small">
                          ₹{parseFloat(ord.final_amount).toLocaleString()}
                        </strong>
                        <span className="badge bg-light text-secondary border d-block mt-1" style={{ fontSize: '0.7rem' }}>
                          {ord.payment_method || 'Cash On Delivery'}
                        </span>
                      </div>
                    </td>

                    {/* Referral Ad Campaign */}
                    <td>
                      {ord.ad_campaign_name || ord.referral_ad_id ? (
                        <span className="badge bg-warning text-dark text-wrap d-inline-flex align-items-center gap-1 p-2" style={{ maxWidth: '170px' }}>
                          <FaBullhorn size={11} />
                          <span>{ord.ad_campaign_name || `Campaign #${ord.referral_ad_id}`}</span>
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted border small">Direct Visit</span>
                      )}
                    </td>

                    {/* Order Status */}
                    <td>
                      <select
                        className={`form-select form-select-sm fw-bold ${
                          ord.order_status === 'delivered'
                            ? 'text-success'
                            : ord.order_status === 'shipped'
                            ? 'text-primary'
                            : 'text-warning'
                        }`}
                        style={{ width: '115px', fontSize: '0.8rem' }}
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.order_id, e.target.value)}
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted small mb-0">No orders placed yet.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderManager;
