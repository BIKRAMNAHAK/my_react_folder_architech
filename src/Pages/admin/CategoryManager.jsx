import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import AdminLayout from '../../Components/AdminLayout';
import CustomAlert from '../../Components/CustomAlert';
import CustomButton from '../../Components/CustomButton';
import CustomLoader from '../../Components/CustomLoader';
import { addCategoryApi, deleteCategoryApi } from '../../Services/Actions/postApis';
import { getCategoriesApi } from '../../Services/Actions/getApis';
import { FaTags, FaPlus, FaTrash, FaImage, FaTimes } from 'react-icons/fa';

const CategoryManager = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  // Modal Visibility State: Default is FALSE (view list is shown by default)
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  useEffect(() => {
    loadCategories();
  }, [dispatch]);

  const loadCategories = async () => {
    setTableLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'GET_CATEGORIES');
    await dispatch(getCategoriesApi(formdata));
    setTableLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setCategoryImage(null);
    setImagePreview('');
    setImageUrl('');
  };

  // Add Category Handler matching requested user syntax
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setAlert({ type: 'error', msg: 'Category name is required' });
      return;
    }

    setLoading(true);
    const formdata = new FormData();
    formdata.append('action', 'ADD_CATEGORY');
    formdata.append('category_name', categoryName.trim());
    formdata.append('description', description.trim());
    if (categoryImage) {
      formdata.append('category_image', categoryImage);
    } else if (imageUrl) {
      formdata.append('category_image_url', imageUrl);
    }

    dispatch(addCategoryApi(formdata))
      .then((res) => {
        setLoading(false);
        if (res.success === true) {
          setAlert({
            type: 'success',
            msg: res.msg || 'Category created! A dedicated section is now visible on the website homepage.'
          });
          resetForm();
          setShowAddModal(false); // Close form modal on success
          loadCategories();
        } else {
          setAlert({ type: 'error', msg: res.msg || 'Failed to add category' });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlert({ type: 'error', msg: 'Request error: ' + err.message });
      });
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Delete this category? (Products inside will remain available).')) {
      const formdata = new FormData();
      formdata.append('action', 'DELETE_CATEGORY');
      formdata.append('category_id', categoryId);

      dispatch(deleteCategoryApi(formdata))
        .then((res) => {
          if (res.success === true) {
            setAlert({ type: 'success', msg: 'Category removed successfully' });
            loadCategories();
          } else {
            setAlert({ type: 'error', msg: res.msg });
          }
        })
        .catch((err) => {
          setAlert({ type: 'error', msg: err.message });
        });
    }
  };

  return (
    <AdminLayout pageTitle="Category Management (Homepage Sections)">
      {alert.msg && <CustomAlert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />}

      {/* TOP HEADER BAR WITH SEPARATED ADD BUTTON */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaTags className="text-primary" />
            <span>Store Categories & Homepage Sections</span>
          </h4>
          <span className="text-muted small">
            Har category ke naam se website homepage par ek dedicated section banta hai jisme top 10 products aate hain.
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
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* DEFAULT FULL-WIDTH VIEW: CATEGORIES TABLE */}
      <div className="admin-card-table p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <h5 className="fw-bold text-dark mb-0">
            Active Category Sections ({categories?.length || 0})
          </h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={loadCategories}>
            Refresh List
          </button>
        </div>

        {tableLoading ? (
          <CustomLoader text="Loading categories..." fullPage={false} />
        ) : categories && categories.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Category Name</th>
                  <th>URL Slug</th>
                  <th>Products Count</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.category_id}>
                    <td>
                      <img
                        src={
                          cat.category_image ||
                          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop'
                        }
                        alt={cat.category_name}
                        className="rounded border"
                        style={{ width: '54px', height: '48px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="text-dark fs-6 d-block">{cat.category_name}</strong>
                      {cat.description && (
                        <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '320px' }}>
                          {cat.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border font-monospace">
                        /{cat.slug || cat.category_id}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fw-bold">
                        {cat.total_products || 0} Hardware Items
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 text-uppercase">
                        Active on Home
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm p-2"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(cat.category_id)}
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No categories created yet.</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              + Create Your First Category
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SEPARATED ADD CATEGORY MODAL (Opens on Button Click)     */}
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
            <span>Create New Category Section</span>
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
          <form onSubmit={handleAddCategory}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Category Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Biometric Thumb Machines, Heavy Duty Printers, CCTV Cameras"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <div className="form-text small">
                Isi naam se website ke homepage par dedicated section generate hoga!
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Category Features / Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Features of products in this category (e.g. Laser, Thermal, High speed attendance)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Upload Category Banner Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 text-center p-2 border rounded bg-light">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Or Image Web URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
                variant="primary"
                loading={loading}
                icon={<FaPlus />}
                className="px-4 fw-bold"
              >
                Save Category & Create Homepage Section
              </CustomButton>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default CategoryManager;
