import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/storage';

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites, clearFavorites } = useFavorites();
  const { cart, getCartTotal, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const { getOrdersByUser } = useOrders();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      loadUserOrders();
    }
  }, [user, activeTab]);

  const loadUserOrders = async () => {
    if (!user) return;
    try {
      setOrdersLoading(true);
      const orders = await getOrdersByUser(user.email);
      setUserOrders(orders);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-section">
      <div className="container">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorilerim
          </button>
          <button
            className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Sepetim
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Siparişlerim
          </button>
        </div>

        <div className="tab-content" style={{ display: activeTab === 'profile' ? 'block' : 'none' }}>
          <div className="admin-form">
            <h2>Profil Bilgileri</h2>
            <div className="form-group">
              <label>Ad Soyad</label>
              <input type="text" value={user?.name || ''} readOnly />
            </div>
            <div className="form-group">
              <label>E-posta</label>
              <input type="email" value={user?.email || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input type="tel" value={user?.phone || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Adres</label>
              <textarea value={user?.address || ''} readOnly rows="3"></textarea>
            </div>
            <button className="btn-primary" onClick={logout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="tab-content" style={{ display: activeTab === 'favorites' ? 'block' : 'none' }}>
          <div className="admin-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Favorilerim</h2>
              {favorites.length > 0 && (
                <button className="btn-secondary" onClick={() => {
                  if (window.confirm('Favorilerinizi temizlemek istediğinize emin misiniz?')) {
                    clearFavorites();
                  }
                }}>
                  Tümünü Temizle
                </button>
              )}
            </div>
            {favorites.length > 0 ? (
              <div className="products-grid">
                {favorites.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <i className="fas fa-heart" style={{ fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#718096', marginBottom: '1rem' }}>Favori ürününüz yok</h3>
                <p style={{ color: '#a0aec0' }}>Beğendiğiniz ürünleri favorilerinize ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>

        <div className="tab-content" style={{ display: activeTab === 'cart' ? 'block' : 'none' }}>
          <div className="admin-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Sepetim</h2>
              {cart.length > 0 && (
                <div>
                  <strong style={{ fontSize: '1.2rem', marginRight: '1rem' }}>
                    Toplam: {formatPrice(getCartTotal())}
                  </strong>
                  <button className="btn-secondary" onClick={() => {
                    if (window.confirm('Sepetinizi temizlemek istediğinize emin misiniz?')) {
                      clearCart();
                    }
                  }}>
                    Sepeti Temizle
                  </button>
                </div>
              )}
            </div>
            {cart.length > 0 ? (
              <div style={{ marginTop: '2rem' }}>
                {cart.map((item) => {
                  const itemId = item.id || `${item.productId}-${item.size}-${item.color}`;
                  return (
                    <div key={itemId} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      backgroundColor: '#fff'
                    }}>
                      <img 
                        src={item.product?.image || item.image || '/placeholder.jpg'} 
                        alt={item.product?.name || item.name}
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginRight: '1.5rem'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          {item.product?.name || item.name}
                        </h3>
                        <div style={{ color: '#718096', marginBottom: '0.5rem' }}>
                          <span style={{ marginRight: '1rem' }}>Beden: <strong>{item.size}</strong></span>
                          <span>Renk: <strong>{item.color}</strong></span>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748' }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.5rem', minWidth: '40px' }}
                            onClick={() => updateCartItemQuantity(itemId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.5rem', minWidth: '40px' }}
                            onClick={() => updateCartItemQuantity(itemId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: '#fff' }}
                          onClick={() => {
                            if (window.confirm('Bu ürünü sepetten çıkarmak istediğinize emin misiniz?')) {
                              removeFromCart(itemId);
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#718096', marginBottom: '1rem' }}>Sepetiniz boş</h3>
                <p style={{ color: '#a0aec0' }}>Beğendiğiniz ürünleri sepete ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>

        <div className="tab-content" style={{ display: activeTab === 'orders' ? 'block' : 'none' }}>
          <div className="admin-form">
            <h2>Siparişlerim</h2>
            {userOrders.length > 0 ? (
              <div className="admin-table" style={{ marginTop: '2rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Sipariş No</th>
                      <th>Ürünler</th>
                      <th>Tutar</th>
                      <th>Teslimat Adresi</th>
                      <th>Telefon</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>
                          {order.items.map((item, index) => (
                            <div key={index} style={{ marginBottom: '0.5rem' }}>
                              {item.product.name} x{item.quantity}
                            </div>
                          ))}
                        </td>
                        <td><strong>{formatPrice(order.total)}</strong></td>
                        <td>
                          <div style={{ maxWidth: '200px', fontSize: '0.9rem' }}>
                            {order.userInfo?.address || '-'}
                          </div>
                        </td>
                        <td>
                          {order.userInfo?.phone || '-'}
                        </td>
                        <td>
                          <span className={`stock-status ${
                            order.status === 'delivered' ? 'stock-ok' :
                            order.status === 'cancelled' ? 'stock-out' :
                            'stock-low'
                          }`}>
                            {order.status === 'pending' ? 'Beklemede' :
                             order.status === 'processing' ? 'İşleniyor' :
                             order.status === 'shipped' ? 'Kargoda' :
                             order.status === 'delivered' ? 'Teslim Edildi' :
                             'İptal'}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <i className="fas fa-shopping-bag" style={{ fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#718096', marginBottom: '1rem' }}>Henüz siparişiniz yok</h3>
                <p style={{ color: '#a0aec0' }}>Siparişleriniz burada görünecektir.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

