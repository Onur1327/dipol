import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';

const FilterSidebar = () => {
  const { categories, products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange({ min: '', max: '' });
    navigate('/products');
  };

  // Tüm bedenleri topla
  const allSizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h3>Kategoriler</h3>
        {categories.map((cat) => (
          <div key={cat.id} className="filter-checkbox">
            <input
              type="radio"
              name="category"
              id={`cat-${cat.id}`}
              value={cat.slug}
              checked={selectedCategories.includes(cat.slug)}
              onChange={() => handleCategoryChange(cat.slug)}
            />
            <label htmlFor={`cat-${cat.id}`}>{cat.name}</label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h3>Beden</h3>
        <div id="sizeFilterContainer">
          {allSizes.map((size) => (
            <div key={size} className="size-filter-checkbox">
              <input
                type="checkbox"
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
              <label htmlFor={`size-${size}`}>{size}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Fiyat Aralığı</h3>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>

      <button className="btn-secondary" onClick={clearFilters} style={{ width: '100%', marginTop: '1rem' }}>
        Filtreleri Temizle
      </button>
    </div>
  );
};

export default FilterSidebar;

