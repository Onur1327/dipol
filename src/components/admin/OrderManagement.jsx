import { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { formatPrice } from '../../utils/storage';

const OrderManagement = () => {
  const { orders, updateOrderStatus, deleteOrder, loadOrders } = useOrders();

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Tümü', color: '#718096' },
    { value: 'pending', label: 'Beklemede', color: '#f59e0b' },
    { value: 'processing', label: 'İşleniyor', color: '#3b82f6' },
    { value: 'shipped', label: 'Kargoda', color: '#8b5cf6' },
    { value: 'delivered', label: 'Teslim Edildi', color: '#10b981' },
    { value: 'cancelled', label: 'İptal', color: '#ef4444' }
  ];

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) {
      deleteOrder(orderId);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Sipariş Yönetimi</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              className={filterStatus === status.value ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setFilterStatus(status.value)}
              style={{ fontSize: '0.9rem' }}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Sipariş No</th>
              <th>Müşteri Bilgileri</th>
              <th>İletişim</th>
              <th>Adres</th>
              <th>Ürünler (Adet)</th>
              <th>Toplam Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  Sipariş bulunamadı.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={order._id || order.id}>
                    <td>
                      <strong style={{ fontSize: '0.9rem' }}>{order.orderNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#718096' }}></i>
                          {order.userInfo?.name || '-'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                          <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                          {order.userInfo?.email || '-'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        {order.userInfo?.phone && (
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#10b981' }}></i>
                            <strong>{order.userInfo.phone}</strong>
                          </div>
                        )}
                        {order.userInfo?.email && (
                          <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                            <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                            {order.userInfo.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '250px', fontSize: '0.85rem' }}>
                        {order.userInfo?.address ? (
                          <>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: '#ef4444' }}></i>
                            <span>{order.userInfo.address}</span>
                          </>
                        ) : (
                          <span style={{ color: '#718096' }}>-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#2d3748' }}>
                          Toplam: <span style={{ color: '#3b82f6' }}>{totalItems} adet</span>
                        </div>
                        {order.items.map((item, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              marginBottom: '0.5rem', 
                              fontSize: '0.85rem',
                              padding: '0.5rem',
                              backgroundColor: '#f7fafc',
                              borderRadius: '4px'
                            }}
                          >
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                              {item.product?.name || item.product?.name || 'Ürün'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                              <span style={{ marginRight: '0.5rem' }}>
                                <strong>Adet:</strong> {item.quantity}
                              </span>
                              {item.size && (
                                <span style={{ marginRight: '0.5rem' }}>
                                  <strong>Beden:</strong> {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span>
                                  <strong>Renk:</strong> {item.color}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '0.25rem' }}>
                              <strong>Birim:</strong> {formatPrice(item.price)} × {item.quantity} = 
                              <strong style={{ color: '#10b981', marginLeft: '0.25rem' }}>
                                {formatPrice(item.price * item.quantity)}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                          {formatPrice(order.total)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                          {order.items.length} ürün
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-white)',
                          color: statusOptions.find(s => s.value === order.status)?.color || '#718096',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        {statusOptions.filter(s => s.value !== 'all').map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>{formatDate(order.createdAt).split(' ')[0]}</div>
                        <div style={{ color: '#718096', fontSize: '0.75rem' }}>
                          {formatDate(order.createdAt).split(' ')[1]}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(order._id || order.id)}
                          title="Sil"
                          style={{ padding: '0.5rem' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;

