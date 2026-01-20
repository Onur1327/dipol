import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import CartModal from './CartModal';
import AuthModal from './AuthModal';
import FavoritesDropdown from './FavoritesDropdown';
import SizeChartModal from './SizeChartModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  
  const { getCartCount } = useCart();
  const { favorites } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleAuth = () => {
    setAuthOpen(!authOpen);
  };

  const toggleFavorites = () => {
    setFavoritesOpen(!favoritesOpen);
  };

  const toggleSizeChart = () => {
    setSizeChartOpen(!sizeChartOpen);
  };

  return (
    <>
      <div className="announcement-banner">
        <p>24 SAATTE KARGONUZ HAZIR</p>
      </div>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link to="/" aria-label="Ana sayfa">
              <img src="/DİPOLBUTİKSAYFALOGO.jpg" alt="DipOL Butik Logo" className="nav-logo" />
              <h1>DipOL Butik</h1>
            </Link>
          </div>
          
          <button 
            className="nav-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Menüyü Aç/Kapat"
          >
            <i className="fas fa-bars"></i>
          </button>
          
          <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</Link>
            
            <div className="nav-categories">
              <Link 
                className="cat-pill" 
                to="/products?category=yeni-gelenler"
                onClick={() => setMobileMenuOpen(false)}
              >
                Yeni Gelenler
              </Link>
              
              <div className="nav-dropdown">
                <Link className="cat-pill" to="/products?category=ust-giyim">Üst Giyim</Link>
                <div className="dropdown-menu">
                  <Link to="/products?category=ust-giyim&sub=elbise">Elbise</Link>
                  <Link to="/products?category=ust-giyim&sub=takim">Takım</Link>
                  <Link to="/products?category=ust-giyim&sub=bluz">Bluz</Link>
                  <Link to="/products?category=ust-giyim&sub=gomlek">Gömlek</Link>
                  <Link to="/products?category=ust-giyim&sub=tisort">Tişört</Link>
                  <Link to="/products?category=ust-giyim&sub=triko">Triko</Link>
                  <Link to="/products?category=ust-giyim&sub=sweatshirt">Sweatshirt</Link>
                </div>
              </div>
              
              <div className="nav-dropdown">
                <Link className="cat-pill" to="/products?category=alt-giyim">Alt Giyim</Link>
                <div className="dropdown-menu">
                  <Link to="/products?category=alt-giyim&sub=jean-pantolon">Jean Pantolon</Link>
                  <Link to="/products?category=alt-giyim&sub=etek">Etek</Link>
                  <Link to="/products?category=alt-giyim&sub=sort">Şort</Link>
                  <Link to="/products?category=alt-giyim&sub=pantolon">Pantolon</Link>
                  <Link to="/products?category=alt-giyim&sub=tayt">Tayt</Link>
                  <Link to="/products?category=alt-giyim&sub=tulum">Tulum</Link>
                </div>
              </div>
              
              <div className="nav-dropdown">
                <Link className="cat-pill" to="/products?category=dis-giyim">Dış Giyim</Link>
                <div className="dropdown-menu">
                  <Link to="/products?category=dis-giyim&sub=hirkа">Hırka</Link>
                  <Link to="/products?category=dis-giyim&sub=ceket">Ceket</Link>
                  <Link to="/products?category=dis-giyim&sub=trenchkot">Trençkot</Link>
                  <Link to="/products?category=dis-giyim&sub=mont">Mont</Link>
                  <Link to="/products?category=dis-giyim&sub=kaban">Kaban</Link>
                </div>
              </div>
              
              <div className="nav-dropdown">
                <Link className="cat-pill" to="/products?category=taki">Takı</Link>
                <div className="dropdown-menu">
                  <Link to="/products?category=taki&sub=kolye">Kolye</Link>
                  <Link to="/products?category=taki&sub=kelepce">Kelepçe</Link>
                  <Link to="/products?category=taki&sub=bileklik">Bileklik</Link>
                  <Link to="/products?category=taki&sub=kupe">Küpe</Link>
                  <Link to="/products?category=taki&sub=yuzuk">Yüzük</Link>
                  <Link to="/products?category=taki&sub=sahmeran">Şahmeran</Link>
                </div>
              </div>
              
              <div className="nav-dropdown">
                <Link className="cat-pill" to="/products?category=mum">Mum</Link>
                <div className="dropdown-menu">
                  <Link to="/products?category=mum&sub=Dekoratiftabak">Dekoratif Tabak</Link>
                  <Link to="/products?category=mum&sub=fanuskibrit">Fanus Kibrit</Link>
                  <Link to="/products?category=mum&sub=organizasyon">Organizasyon</Link>
                  <Link to="/products?category=mum&sub=hediyelik">Hediyelik</Link>
                  <Link to="/products?category=mum&sub=nişan-kina-dugun">Nişan-Kına-Düğün</Link>
                  <Link to="/products?category=mum&sub=Doğumgünü">Doğum Günü</Link>
                </div>
              </div>
              
              <Link className="cat-pill" to="/products?category=indirimli">İndirimli</Link>
            </div>
            
            <a href="#" onClick={(e) => { e.preventDefault(); toggleSizeChart(); }}>
              Beden Tablosu
            </a>
            
            {isAuthenticated && (
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                Hesabım
              </Link>
            )}
            
            <div className="nav-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSearch(); }}>
                <i className="fas fa-search"></i>
              </a>
              
              <div className="nav-favorites">
                <button
                  type="button"
                  className="icon-button favorite-trigger"
                  onClick={toggleFavorites}
                  aria-label="Favoriler"
                  aria-expanded={favoritesOpen}
                >
                  <i className="fas fa-heart"></i>
                  <span className="icon-badge favorites-count">{favorites.length}</span>
                </button>
                {favoritesOpen && <FavoritesDropdown onClose={() => setFavoritesOpen(false)} />}
              </div>
              
              {isAuthenticated ? (
                <Link to="/account" className="auth-trigger" title="Hesabım">
                  <i className="fas fa-user"></i>
                  <span id="authLabel" className="auth-label">
                    {user.name}
                  </span>
                </Link>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); toggleAuth(); }} className="auth-trigger">
                  <i className="fas fa-user"></i>
                  <span id="authLabel" className="auth-label">
                    Üye Girişi
                  </span>
                </a>
              )}
              
              <a href="#" onClick={(e) => { e.preventDefault(); toggleCart(); }}>
                <i className="fas fa-shopping-bag"></i>
                <span className="icon-badge cart-count">{getCartCount()}</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {searchOpen && <SearchBar onClose={toggleSearch} />}
      {cartOpen && <CartModal onClose={toggleCart} />}
      {authOpen && <AuthModal onClose={toggleAuth} />}
      {sizeChartOpen && <SizeChartModal onClose={toggleSizeChart} />}
    </>
  );
};

export default Navbar;

