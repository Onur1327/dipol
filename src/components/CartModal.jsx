import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import OrderForm from './OrderForm';

const CartModal = ({ onClose }) => {
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);

  // ESC tuşu ile modal'ı kapat
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    // Body scroll'u engelle
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleProceedToOrder = () => {
    if (!user) {
      alert('Sipariş vermek için giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Sepetiniz boş.');
      return;
    }

    setShowOrderForm(true);
  };

  const handleCreateOrder = async (phone, address) => {
    const userInfo = {
      name: user.name,
      email: user.email
    };

    try {
      await createOrder(cart, userInfo, getCartTotal(), address, phone);
      clearCart();
      onClose();
      alert('Siparişiniz başarıyla oluşturuldu!');
      navigate('/account?tab=orders');
    } catch (error) {
      alert(error.message || 'Sipariş oluşturulurken bir hata oluştu.');
    }
  };

  if (!cart) {
    return null;
  }

  return (
    <div 
      id="cartModal" 
      className="modal active" 
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target.id === 'cartModal' || e.target.classList.contains('modal')) {
          onClose();
        }
      }}
    >
      <div className="modal-content cart-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sepetim</h2>
          <button onClick={onClose} type="button">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div id="cartItems" className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
              Sepetiniz boş.
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.product?.image || item.product?.images?.[0] || '/placeholder-image.jpg'} 
                    alt={item.product?.name || 'Ürün'} 
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product?.name || 'Ürün'}</div>
                  <div className="cart-item-details">
                    Beden: {item.size || '-'} | Renk: {item.color || '-'}
                  </div>
                  <div className="cart-item-price">{formatPrice(item.price || 0)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      style={{ 
                        padding: '0.25rem 0.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        background: 'var(--bg-white)',
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      disabled={
                        typeof item.product?.stock === 'number' &&
                        item.product.stock >= 0 &&
                        item.quantity >= item.product.stock
                      }
                      style={{ 
                        padding: '0.25rem 0.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        background: 'var(--bg-white)',
                        cursor: (typeof item.product?.stock === 'number' &&
                          item.product.stock >= 0 &&
                          item.quantity >= item.product.stock) ? 'not-allowed' : 'pointer',
                        opacity: (typeof item.product?.stock === 'number' &&
                          item.product.stock >= 0 &&
                          item.quantity >= item.product.stock) ? 0.6 : 1
                      }}
                    >
                      +
                    </button>
                  </div>
                  {typeof item.product?.stock === 'number' && item.product.stock >= 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                      Maksimum stok: {item.product.stock} adet
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#ef4444',
                    padding: '0.5rem',
                    fontSize: '1.2rem'
                  }}
                  title="Sepetten Çıkar"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Toplam:</span>
              <span id="cartTotal">{formatPrice(getCartTotal())}</span>
            </div>
            {!showOrderForm ? (
              <button className="btn-primary" onClick={handleProceedToOrder}>
                <i className="fas fa-arrow-right"></i> Siparişe Geç
              </button>
            ) : (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Teslimat Bilgileri</h3>
                <OrderForm
                  user={user}
                  onSubmit={handleCreateOrder}
                  onCancel={() => setShowOrderForm(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

