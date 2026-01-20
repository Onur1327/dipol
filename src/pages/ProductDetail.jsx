import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/storage';
import ImageSlider from '../components/ImageSlider';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // Önce context'ten kontrol et
      let foundProduct = getProductById(id);
      
      // Eğer context'te yoksa API'den çek
      if (!foundProduct) {
        const data = await productsAPI.getById(id);
        if (data.success) {
          foundProduct = data.product;
        }
      }

      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      }
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Ürün bulunamadı.</div>;
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Lütfen beden ve renk seçiniz.');
      return;
    }

    if (product.stock !== undefined && product.stock !== null) {
      const safeStock = parseInt(product.stock);
      if (safeStock >= 0 && quantity > safeStock) {
        alert(`Bu üründen en fazla ${safeStock} adet seçebilirsiniz.`);
        return;
      }
    }
    
    console.log('ProductDetail - Sepete ekleniyor:', { 
      product: product.name, 
      productId: product._id || product.id,
      size: selectedSize, 
      color: selectedColor,
      quantity 
    });
    
    const result = await addToCart(product, selectedSize, selectedColor, quantity);
    
    if (result) {
      alert('Ürün sepete eklendi!');
    } else {
      alert('Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      let min = 1;
      let max = Number.MAX_SAFE_INTEGER;

      if (product.stock !== undefined && product.stock !== null) {
        const safeStock = parseInt(product.stock);
        if (!Number.isNaN(safeStock) && safeStock > 0) {
          max = safeStock;
        }
      }

      return Math.min(Math.max(min, next), max);
    });
  };

  const favoriteActive = isFavorite(product._id || product.id);

  return (
    <div className="product-detail-section">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <ImageSlider images={product.images || [product.image]} />
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-price">
              <span className="price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="old-price">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <div className="product-description">
              {product.description}
            </div>

            <div className="product-options">
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Beden</label>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Renk</label>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {selectedColor === color && <i className="fas fa-check"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label>Miktar</label>
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <input
                    type="number"
                    value={quantity}
                onChange={(e) => {
                  const raw = parseInt(e.target.value) || 1;
                  let min = 1;
                  let max = Number.MAX_SAFE_INTEGER;

                  if (product.stock !== undefined && product.stock !== null) {
                    const safeStock = parseInt(product.stock);
                    if (!Number.isNaN(safeStock) && safeStock > 0) {
                      max = safeStock;
                    }
                  }

                  setQuantity(Math.min(Math.max(min, raw), max));
                }}
                min="1"
                max={product.stock && product.stock > 0 ? product.stock : undefined}
                  />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={product.stock && quantity >= product.stock}
              >
                +
              </button>
                </div>
              </div>

              {product.stock > 0 ? (
                <div className="stock-info">
                  <i className="fas fa-check-circle"></i>
                  <span>Stokta var</span>
                </div>
              ) : (
                <div className="stock-info" style={{ color: '#ef4444' }}>
                  <i className="fas fa-times-circle"></i>
                  <span>Stokta yok</span>
                </div>
              )}

              <div className="product-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Sepete Ekle
                </button>
                <button
                  className={`btn-secondary favorite-btn ${favoriteActive ? 'active' : ''}`}
                  onClick={() => toggleFavorite({ ...product, id: product._id || product.id })}
                >
                  <i className={favoriteActive ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Özellikleri Tab Sistemi */}
        <div className="product-specs-tabs">
          <div className="specs-tab-header">
            <button
              className={`specs-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Açıklama
            </button>
            <button
              className={`specs-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Özellikler
            </button>
          </div>
          <div className={`specs-tab-content ${activeTab === 'description' ? 'active' : ''}`}>
            <p>{product.description}</p>
          </div>
          <div className={`specs-tab-content ${activeTab === 'specs' ? 'active' : ''}`}>
            <ul className="product-specs-list">
              <li>
                <strong>Kategori:</strong>
                <span className="spec-value">{product.category}</span>
              </li>
              <li>
                <strong>Bedenler:</strong>
                <span className="spec-value">{product.sizes?.join(', ') || 'N/A'}</span>
              </li>
              <li>
                <strong>Renkler:</strong>
                <span className="spec-value">{product.colors?.join(', ') || 'N/A'}</span>
              </li>
              <li>
                <strong>Stok:</strong>
                <span className="spec-value">{product.stock || 0} adet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

