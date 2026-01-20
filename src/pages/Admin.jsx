import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import StockManagement from '../components/admin/StockManagement';

const Admin = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Auth yüklenene kadar bekle
    if (authLoading) {
      return;
    }

    console.log('Admin sayfası - Auth durumu:', { isAuthenticated, user, authLoading });
    
    if (!isAuthenticated) {
      console.log('Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor...');
      navigate('/login');
      return;
    }
    
    // Admin kontrolü
    if (user && user.role !== 'admin') {
      console.log('Kullanıcı admin değil, ana sayfaya yönlendiriliyor. Rol:', user.role);
      navigate('/');
      alert('Bu sayfaya erişim yetkiniz yok. Sadece admin kullanıcıları erişebilir.');
      return;
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Auth yükleniyor
  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  // Giriş yapılmamış
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Giriş yapmanız gerekiyor...</div>
      </div>
    );
  }

  // Admin kontrolü
  if (user && user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Erişim Reddedildi</h2>
        <p>Bu sayfaya erişim yetkiniz yok. Sadece admin kullanıcıları erişebilir.</p>
        <p>Kullanıcı rolü: {user?.role || 'belirtilmemiş'}</p>
        <p>Kullanıcı e-posta: {user?.email || 'belirtilmemiş'}</p>
      </div>
    );
  }

  // Kullanıcı bilgisi henüz yüklenmemiş
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Kullanıcı bilgileri yükleniyor...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'products', label: 'Ürünler', icon: 'fas fa-box' },
    { id: 'categories', label: 'Kategoriler', icon: 'fas fa-tags' },
    { id: 'orders', label: 'Siparişler', icon: 'fas fa-shopping-cart' },
    { id: 'stock', label: 'Stok Yönetimi', icon: 'fas fa-warehouse' },
    { id: 'users', label: 'Kullanıcılar', icon: 'fas fa-users' }
  ];

  return (
    <div className="admin-section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-light)' }}>Site yönetimi ve kontrol paneli</p>
        </div>

        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon} style={{ marginRight: '0.5rem' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <Dashboard />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="tab-content">
            <ProductManagement />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tab-content">
            <CategoryManagement />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-content">
            <OrderManagement />
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="tab-content">
            <StockManagement />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
