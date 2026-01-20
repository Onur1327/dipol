import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import HeroCategories from '../components/HeroCategories';

const Home = () => {
  const { products, loading } = useProducts();
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const newProductsList = products
        .filter(p => p.isNew)
        .slice(0, 8);
      setNewProducts(newProductsList);
    }
  }, [products]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;
  }

  return (
    <>
      <HeroCarousel />
      <HeroCategories />
      
      <div className="container mt-4" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <h2 className="baslik text-center mb-4">YENİ ÜRÜNLER</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {newProducts.length > 0 ? (
                newProducts.map((product) => (
                  <div key={product._id || product.id} className="col">
                    <ProductCard product={product} />
                  </div>
                ))
          ) : (
            <div className="col-12">
              <p style={{ textAlign: 'center', padding: '2rem' }}>Henüz yeni ürün yok.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

