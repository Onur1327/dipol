import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { formatPrice } from '../../utils/storage';
import ImageUpload from './ImageUpload';
import SizeColorManager from './SizeColorManager';

const ProductManagement = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    oldPrice: '',
    description: '',
    stock: '',
    isNew: false,
    isDiscounted: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (productImages.length === 0) {
      alert('Lütfen en az bir görsel ekleyin.');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock) || 0,
      images: productImages,
      image: productImages[0],
      sizes: selectedSizes,
      colors: selectedColors
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, productData);
        alert('Ürün güncellendi!');
      } else {
        await addProduct(productData);
        alert('Ürün eklendi!');
      }
      resetForm();
    } catch (error) {
      console.error('Ürün işlemi hatası:', error);
      alert('Ürün eklenirken/güncellenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      oldPrice: '',
      description: '',
      stock: '',
      isNew: false,
      isDiscounted: false
    });
    setEditingProduct(null);
    setProductImages([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      description: product.description || '',
      stock: product.stock?.toString() || '0',
      isNew: product.isNew || false,
      isDiscounted: product.isDiscounted || false
    });
    setProductImages(product.images || [product.image]);
    setSelectedSizes(product.sizes || []);
    setSelectedColors(product.colors || []);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      deleteProduct(id);
      if ((editingProduct?._id || editingProduct?.id) === id) {
        resetForm();
      }
    }
  };

  const handleBulkDelete = (selectedIds) => {
    if (window.confirm(`${selectedIds.length} ürünü silmek istediğinize emin misiniz?`)) {
      selectedIds.forEach(id => deleteProduct(id));
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Ürün Yönetimi</h2>
        <button className="btn-primary" onClick={resetForm}>
          <i className="fas fa-plus"></i> Yeni Ürün Ekle
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Kategori *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Seçiniz</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fiyat (₺) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Eski Fiyat (₺) - İndirimli ise</label>
            <input
              type="number"
              step="0.01"
              value={formData.oldPrice}
              onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            placeholder="Ürün açıklaması..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Görseller *</label>
          <ImageUpload
            images={productImages}
            onImagesChange={setProductImages}
          />
        </div>

        <div className="form-group">
          <label>Bedenler</label>
          <SizeColorManager
            type="sizes"
            items={selectedSizes}
            onChange={setSelectedSizes}
          />
        </div>

        <div className="form-group">
          <label>Renkler</label>
          <SizeColorManager
            type="colors"
            items={selectedColors}
            onChange={setSelectedColors}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stok Miktarı *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
              />
              Yeni Ürün
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.isDiscounted}
                onChange={(e) => setFormData({ ...formData, isDiscounted: e.target.checked })}
              />
              İndirimli
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            <i className="fas fa-save"></i> {editingProduct ? 'Güncelle' : 'Kaydet'}
          </button>
          {editingProduct && (
            <button className="btn-secondary" type="button" onClick={resetForm}>
              <i className="fas fa-times"></i> İptal
            </button>
          )}
        </div>
      </form>

      <div className="admin-table" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Ürün Listesi ({products.length})</h3>
          <input
            type="text"
            placeholder="Ürün ara..."
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Bedenler</th>
                <th>Renkler</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                    Henüz ürün yok.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id || product.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.isNew && (
                        <span className="product-badge" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                          Yeni
                        </span>
                      )}
                      {product.isDiscounted && (
                        <span className="product-badge" style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#ef4444' }}>
                          İndirim
                        </span>
                      )}
                    </td>
                    <td>{product.category}</td>
                    <td>
                      {product.sizes && product.sizes.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {product.sizes.map((size, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '0.25rem 0.5rem',
                                background: 'var(--bg-light)',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                border: '1px solid var(--border-color)'
                              }}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      {product.colors && product.colors.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                          {product.colors.map((color, idx) => {
                            const colorMap = {
                              'Siyah': '#000000',
                              'Beyaz': '#FFFFFF',
                              'Kırmızı': '#FF0000',
                              'Mavi': '#0000FF',
                              'Yeşil': '#008000',
                              'Sarı': '#FFFF00',
                              'Pembe': '#FFC0CB',
                              'Mor': '#800080',
                              'Gri': '#808080',
                              'Bej': '#F5F5DC',
                              'Kahverengi': '#A52A2A',
                              'Lacivert': '#000080',
                              'Turuncu': '#FFA500',
                              'Bordo': '#800020'
                            };
                            const colorHex = colorMap[color] || '#E2E8F0';
                            const isDark = ['Siyah', 'Mavi', 'Lacivert', 'Kahverengi', 'Mor', 'Bordo'].includes(color);
                            return (
                              <span
                                key={idx}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: colorHex,
                                  color: isDark ? 'white' : 'black',
                                  borderRadius: '4px',
                                  fontSize: '0.85rem',
                                  border: '1px solid var(--border-color)',
                                  minWidth: '50px',
                                  textAlign: 'center',
                                  display: 'inline-block'
                                }}
                                title={color}
                              >
                                {color}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <strong>{formatPrice(product.price)}</strong>
                      {product.oldPrice && (
                        <div style={{ fontSize: '0.85rem', color: '#718096', textDecoration: 'line-through' }}>
                          {formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`stock-status ${product.stock > 10 ? 'stock-ok' : product.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>
                      {product.stock > 0 ? (
                        <span style={{ color: '#10b981' }}>Stokta</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>Tükendi</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                          title="Düzenle"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(product._id || product.id)}
                          title="Sil"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;

