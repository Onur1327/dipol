import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const category = searchParams.get('category');
  const subcategory = searchParams.get('sub');
  const search = searchParams.get('search');

  useEffect(() => {
    let filtered = [...products];

    // Kategori filtresi
    if (category) {
      if (category === 'yeni-gelenler') {
        filtered = filtered.filter(p => p.isNew);
      } else if (category === 'indirimli') {
        filtered = filtered.filter(p => p.isDiscounted);
      } else {
        filtered = filtered.filter(p => p.category === category);
      }
    }

    // Arama filtresi
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Sıralama
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [products, category, subcategory, search, sortBy]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">
          {category ? (
            category === 'yeni-gelenler' ? 'Yeni Gelenler' :
            category === 'indirimli' ? 'İndirimli Ürünler' :
            category
          ) : search ? `"${search}" için sonuçlar` : 'Tüm Ürünler'}
        </h1>

        <div className="products-layout">
          <FilterSidebar />
          
          <div className="products-main">
            <div className="products-header">
              <span>{filteredProducts.length} ürün bulundu</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Varsayılan</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="name">İsme Göre</option>
              </select>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                  <p>Ürün bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

