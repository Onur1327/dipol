import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../utils/storage';
import ImageSlider from './ImageSlider';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Varsayılan beden ve renk seç
    const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'Tek Beden';
    const defaultColor = (product.colors && product.colors.length > 0) ? product.colors[0] : 'Tek Renk';

     if (typeof product.stock === 'number' && product.stock <= 0) {
      alert('Bu ürün stokta yok.');
      return;
    }
    
    console.log('ProductCard - Sepete ekleniyor:', { 
      product: product.name, 
      productId: product._id || product.id,
      size: defaultSize, 
      color: defaultColor 
    });
    
    const result = await addToCart(product, defaultSize, defaultColor, 1);
    
    if (result) {
      console.log('Ürün sepete eklendi');
    } else {
      console.error('Ürün sepete eklenemedi');
      alert('Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const favoriteActive = isFavorite(product._id || product.id);

  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="new-product-card card"
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
        <ImageSlider images={product.images || [product.image]} />
        
        {isHovered && (
          <div className="product-hover-overlay">
            <button
              className="hover-action-btn add-to-favorites"
              onClick={handleToggleFavorite}
              aria-label={favoriteActive ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <i className={favoriteActive ? 'fas fa-heart' : 'far fa-heart'}></i>
            </button>
            <button
              className="hover-action-btn add-to-cart"
              onClick={handleAddToCart}
              aria-label="Sepete ekle"
            >
              <i className="fas fa-shopping-bag"></i>
            </button>
          </div>
        )}
        
        {product.isNew && (
          <div className="product-badge" style={{ position: 'absolute', top: '10px', right: '10px' }}>
            Yeni
          </div>
        )}
        {product.isDiscounted && (
          <div className="product-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: '#ef4444' }}>
            İndirim
          </div>
        )}
      </div>
      
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text" style={{ color: '#718096', fontSize: '0.9rem' }}>
          {product.category}
        </p>
        <div className="product-price-group">
          <span className="price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

