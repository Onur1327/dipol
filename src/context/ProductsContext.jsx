import { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Ürünler yükleniyor...');
      const data = await productsAPI.getAll();
      console.log('Ürünler yüklendi:', data);
      if (data.success) {
        setProducts(data.products || []);
        console.log('Toplam ürün sayısı:', (data.products || []).length);
      } else {
        console.error('Ürünler yüklenemedi:', data.message);
      }
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setCategories([]);
    }
  };

  const addProduct = async (product) => {
    try {
      const data = await productsAPI.create(product);
      if (data.success) {
        await loadProducts();
        return data.product;
      }
      throw new Error(data.message || 'Ürün eklenemedi');
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const data = await productsAPI.update(id, updates);
      if (data.success) {
        await loadProducts();
        return data.product;
      }
      throw new Error(data.message || 'Ürün güncellenemedi');
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const data = await productsAPI.delete(id);
      if (data.success) {
        await loadProducts();
      } else {
        throw new Error(data.message || 'Ürün silinemedi');
      }
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      throw error;
    }
  };

  const addCategory = async (category) => {
    try {
      const data = await categoriesAPI.create(category);
      if (data.success) {
        await loadCategories();
        return data.category;
      }
      throw new Error(data.message || 'Kategori eklenemedi');
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
      throw error;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const data = await categoriesAPI.update(id, updates);
      if (data.success) {
        await loadCategories();
        return data.category;
      }
      throw new Error(data.message || 'Kategori güncellenemedi');
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const data = await categoriesAPI.delete(id);
      if (data.success) {
        await loadCategories();
      } else {
        throw new Error(data.message || 'Kategori silinemedi');
      }
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      throw error;
    }
  };

  const getProductById = (id) => {
    return products.find(p => String(p._id) === String(id) || String(p.id) === String(id));
  };

  const getProductsByCategory = (category) => {
    if (!category) return products;
    return products.filter(p => p.category === category);
  };

  const searchProducts = (query) => {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    );
  };

  const getProductStats = async () => {
    try {
      const data = await productsAPI.getStats();
      if (data.success) {
        return data.stats;
      }
      return {
        total: products.length,
        inStock: products.filter(p => p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
        newProducts: products.filter(p => p.isNew).length,
        discounted: products.filter(p => p.isDiscounted).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
      };
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      return {
        total: products.length,
        inStock: products.filter(p => p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
        newProducts: products.filter(p => p.isNew).length,
        discounted: products.filter(p => p.isDiscounted).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
      };
    }
  };

  const value = {
    products,
    categories,
    loading,
    loadProducts,
    loadCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getProductStats
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
