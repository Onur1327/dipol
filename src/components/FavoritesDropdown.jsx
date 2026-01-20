import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const FavoritesDropdown = ({ onClose }) => {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div id="favoritesDropdown" className="favorites-dropdown active">
      <div className="favorites-dropdown-header">
        <span>Favorilerim</span>
        <button type="button" className="favorites-clear" onClick={() => {
          if (window.confirm('Favorilerinizi temizlemek istediğinize emin misiniz?')) {
            // clearFavorites will be called from parent
          }
        }}>
          Temizle
        </button>
      </div>
      <div id="favoritesDropdownList" className="favorites-dropdown-list">
        {favorites.length === 0 ? (
          <p className="favorites-empty">Favori ürününüz yok.</p>
        ) : (
          favorites.map((item) => (
            <div key={item.id} className="favorites-item" data-id={item.id}>
              <div className="favorites-thumb" onClick={() => handleProductClick(item.id)}>
                <img src={item.image || item.images?.[0]} alt={item.name} />
              </div>
              <div className="favorites-item-info" onClick={() => handleProductClick(item.id)}>
                <h4>{item.name}</h4>
                <span>{formatPrice(item.price)}</span>
              </div>
              <button
                className="favorites-remove"
                type="button"
                aria-label="Favoriden çıkar"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromFavorites(item.id);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="favorites-dropdown-footer">
        <a href="/account#favorites" onClick={(e) => { e.preventDefault(); onClose(); navigate('/account?tab=favorites'); }}>Favorilerimi Gör</a>
      </div>
    </div>
  );
};

export default FavoritesDropdown;

