import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { formatPrice } from '../../utils/storage';

const StockManagement = () => {
  const { products, updateProduct } = useProducts();
  const [filter, setFilter] = useState('all'); // all, low, out

  const filteredProducts = products.filter(product => {
    if (filter === 'low') return product.stock > 0 && product.stock < 10;
    if (filter === 'out') return product.stock === 0;
    return true;
  });

  const handleStockUpdate = (productId, newStock) => {
    updateProduct(productId, { stock: parseInt(newStock) || 0 });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Tükendi', color: '#ef4444', class: 'stock-out' };
    if (stock < 10) return { label: 'Düşük', color: '#f59e0b', class: 'stock-low' };
    return { label: 'Stokta', color: '#10b981', class: 'stock-ok' };
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Stok Yönetimi</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button
            className={filter === 'low' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter('low')}
          >
            Düşük Stok
          </button>
          <button
            className={filter === 'out' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter('out')}
          >
            Tükenenler
          </button>
        </div>
      </div>

      <div className="stock-alerts" style={{ marginBottom: '2rem' }}>
        <div className="alert-box">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <h4>Düşük Stok Uyarısı</h4>
            <p>{products.filter(p => p.stock > 0 && p.stock < 10).length} ürün düşük stokta</p>
          </div>
        </div>
        <div className="alert-box">
          <i className="fas fa-times-circle"></i>
          <div>
            <h4>Tükenen Ürünler</h4>
            <p>{products.filter(p => p.stock === 0).length} ürün stokta yok</p>
          </div>
        </div>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Mevcut Stok</th>
              <th>Durum</th>
              <th>Fiyat</th>
              <th>Stok Değeri</th>
              <th>Yeni Stok</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  Ürün bulunamadı.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product._id || product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`stock-status ${stockStatus.class}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: stockStatus.color }}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <strong>{formatPrice(product.price * (product.stock || 0))}</strong>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.stock || 0}
                        style={{
                          width: '80px',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleStockUpdate(product._id || product.id, e.target.value);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          const input = e.target.closest('tr').querySelector('input[type="number"]');
                          handleStockUpdate(product._id || product.id, input.value);
                        }}
                        title="Güncelle"
                      >
                        <i className="fas fa-save"></i>
                      </button>
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

export default StockManagement;

