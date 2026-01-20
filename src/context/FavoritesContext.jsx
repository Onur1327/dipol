import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = storage.get('favorites', []);
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      setFavorites(newFavorites);
      storage.set('favorites', newFavorites);
    } catch (error) {
      console.error('Favoriler kaydedilirken hata:', error);
    }
  };

  const addToFavorites = (product) => {
    try {
      if (isFavorite(product._id || product.id)) {
        return false;
      }
      const newFavorites = [...favorites, product];
      saveFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error('Favorilere eklenirken hata:', error);
      return false;
    }
  };

  const removeFromFavorites = (productId) => {
    try {
      const newFavorites = favorites.filter(p => (p._id || p.id) !== productId);
      saveFavorites(newFavorites);
    } catch (error) {
      console.error('Favorilerden çıkarılırken hata:', error);
    }
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product._id || product.id)) {
      removeFromFavorites(product._id || product.id);
      return false;
    } else {
      addToFavorites(product);
      return true;
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(p => (p._id || p.id) === productId);
  };

  const clearFavorites = () => {
    try {
      saveFavorites([]);
    } catch (error) {
      console.error('Favoriler temizlenirken hata:', error);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

