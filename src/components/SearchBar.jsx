import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div id="searchBar" className="search-bar active">
      <div className="container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            id="searchInput"
            placeholder="Ürün ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </form>
        <button onClick={onClose} type="button">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

