import React from 'react';
import store from './Services/store';
import { Route, Routes, Navigate } from 'react-router';
import { Provider } from 'react-redux';

// User Pages
import Home from './Pages/user/Home';
import ProductList from './Pages/user/ProductList';
import ProductDetail from './Pages/user/ProductDetail';
import Cart from './Pages/user/Cart';
import Checkout from './Pages/user/Checkout';
import OrderSuccess from './Pages/user/OrderSuccess';
import AdOffer from './Pages/user/AdOffer';
import AdBannerWidget from './Pages/user/AdBannerWidget';

// Admin Pages
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import CategoryManager from './Pages/admin/CategoryManager';
import ProductManager from './Pages/admin/ProductManager';
import OrderManager from './Pages/admin/OrderManager';
import AdvertisementManager from './Pages/admin/AdvertisementManager';
import CustomerManager from './Pages/admin/CustomerManager';
import LeadManager from './Pages/admin/LeadManager';
import StoreSettings from './Pages/admin/StoreSettings';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:categorySlug" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/offer/:adId" element={<AdOffer />} />
        <Route path="/ad/:adId" element={<AdOffer />} />
        <Route path="/ad-banner" element={<AdBannerWidget />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoryManager />} />
        <Route path="/admin/products" element={<ProductManager />} />
        <Route path="/admin/orders" element={<OrderManager />} />
        <Route path="/admin/advertisements" element={<AdvertisementManager />} />
        <Route path="/admin/customers" element={<CustomerManager />} />
        <Route path="/admin/leads" element={<LeadManager />} />
        <Route path="/admin/settings" element={<StoreSettings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Provider>
  );
};

export default App;