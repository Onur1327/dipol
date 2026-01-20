import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromBackend();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  const loadCartFromBackend = async () => {
    try {
      const data = await cartAPI.getCart();
      if (data.success && data.cart) {
        setCart(data.cart.items || []);
      }
    } catch (error) {
      console.error('Sepet backend\'den yüklenirken hata:', error);
      // Hata durumunda localStorage'dan yükle
      loadCartFromLocalStorage();
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = storage.get('cart', []);
      setCart(savedCart);
    } catch (error) {
      console.error('Sepet localStorage\'dan yüklenirken hata:', error);
    }
  };

  const saveCart = async (newCart) => {
    try {
      setCart(newCart);
      
      // Eğer kullanıcı giriş yapmışsa backend'e kaydet
      if (isAuthenticated && user) {
        // Backend'deki sepeti güncellemek için her item'ı ekle
        // Not: Bu basit bir yaklaşım, daha iyi bir yöntem tüm sepeti bir seferde güncellemek olabilir
        // Şimdilik localStorage'a da kaydedelim (offline durumlar için)
        storage.set('cart', newCart);
      } else {
        // Giriş yapılmamışsa sadece localStorage'a kaydet
        storage.set('cart', newCart);
      }
    } catch (error) {
      console.error('Sepet kaydedilirken hata:', error);
    }
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    try {
      const productId = product._id || product.id;
      
      if (!productId) {
        console.error('Ürün ID bulunamadı:', product);
        return false;
      }

      if (!size || !color) {
        console.error('Beden veya renk seçilmedi:', { size, color });
        return false;
      }

      const parsedQuantity = parseInt(quantity) || 1;
      if (parsedQuantity < 1) {
        console.error('Geçersiz miktar:', quantity);
        return false;
      }

      // Mevcut sepetteki aynı ürün + varyant miktarını bul
      const cartItemId = `${productId}-${size}-${color}`;
      const existingItem = cart.find(item => item.id === cartItemId);
      const existingQuantity = existingItem ? existingItem.quantity || 0 : 0;
      const newTotalQuantity = existingQuantity + parsedQuantity;

      // Frontend tarafında stok kontrolü (hem misafir hem giriş yapmış kullanıcılar için)
      if (typeof product.stock === 'number' && product.stock >= 0 && newTotalQuantity > product.stock) {
        const maxCanAdd = Math.max(0, product.stock - existingQuantity);
        console.warn('Stok aşıldı (frontend addToCart):', {
          productId,
          stock: product.stock,
          existingQuantity,
          requestedQuantity: parsedQuantity,
          attemptedTotal: newTotalQuantity
        });
        alert(
          maxCanAdd > 0
            ? `Bu üründen toplam en fazla ${product.stock} adet ekleyebilirsiniz. Sepetinizde zaten ${existingQuantity} adet var, en fazla ${maxCanAdd} adet daha ekleyebilirsiniz.`
            : `Bu üründen sepette zaten maksimum stok (${product.stock} adet) bulunuyor. Daha fazla ekleyemezsiniz.`
        );
        return false;
      }
      
      // Eğer kullanıcı giriş yapmışsa backend'e ekle
      if (isAuthenticated && user) {
        try {
          console.log('Backend\'e sepete ekleniyor:', { productId, size, color, quantity });
          const data = await cartAPI.addToCart(productId, size, color, parsedQuantity);
          console.log('Backend yanıtı:', data);
          if (data.success && data.cart) {
            setCart(data.cart.items || []);
            // localStorage'ı da güncelle
            storage.set('cart', data.cart.items || []);
            return true;
          } else {
            console.error('Backend başarısız yanıt:', data);
          }
        } catch (error) {
          console.error('Backend\'e eklenirken hata:', error);
          // Backend stok / doğrulama hatası varsa localStorage'a düşmeyelim
          alert(error.message || 'Ürün sepete eklenirken bir hata oluştu.');
          return false;
        }
      }

      // Giriş yapılmamışsa veya backend hatası varsa localStorage'a ekle
      const cartItem = {
        id: `${productId}-${size}-${color}`,
        productId: productId,
        product: {
          _id: product._id,
          id: productId,
          name: product.name,
          image: product.image || product.images?.[0],
          price: product.price,
          stock: product.stock
        },
        size,
        color,
        quantity: parsedQuantity,
        price: product.price
      };

      const existingItemIndex = cart.findIndex(
        item => item.id === cartItem.id
      );

      let newCart;
      if (existingItemIndex > -1) {
        newCart = [...cart];
        newCart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        newCart = [...cart, cartItem];
      }

      saveCart(newCart);
      return true;
    } catch (error) {
      console.error('Sepete eklenirken hata:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Eğer kullanıcı giriş yapmışsa backend'den sil
      if (isAuthenticated && user) {
        try {
          const data = await cartAPI.removeFromCart(itemId);
          if (data.success && data.cart) {
            setCart(data.cart.items || []);
            storage.set('cart', data.cart.items || []);
            return;
          }
        } catch (error) {
          console.error('Backend\'den silinirken hata:', error);
        }
      }

      // Giriş yapılmamışsa veya backend hatası varsa localStorage'dan sil
      const newCart = cart.filter(item => item.id !== itemId);
      saveCart(newCart);
    } catch (error) {
      console.error('Sepetten çıkarılırken hata:', error);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      const parsedQuantity = parseInt(quantity);

      if (!parsedQuantity || parsedQuantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      // İlgili ürünü bul ve stok kontrolü yap (frontend tarafında)
      const item = cart.find(i => i.id === itemId);
      const itemStock = item?.product?.stock;

      if (typeof itemStock === 'number' && itemStock >= 0 && parsedQuantity > itemStock) {
        console.warn('Stok aşıldı (frontend updateCartItemQuantity):', {
          itemId,
          stock: itemStock,
          requestedQuantity: parsedQuantity
        });
        alert(`Bu üründen en fazla ${itemStock} adet sepette bulundurabilirsiniz.`);
        return;
      }

      // Eğer kullanıcı giriş yapmışsa backend'i güncelle
      if (isAuthenticated && user) {
        try {
          const data = await cartAPI.updateCartItem(itemId, parsedQuantity);
          if (data.success && data.cart) {
            setCart(data.cart.items || []);
            storage.set('cart', data.cart.items || []);
            return;
          }
        } catch (error) {
          console.error('Backend güncellenirken hata:', error);
        }
      }

      // Giriş yapılmamışsa veya backend hatası varsa localStorage'ı güncelle
      const newCart = cart.map(item =>
        item.id === itemId ? { ...item, quantity: parsedQuantity } : item
      );
      saveCart(newCart);
    } catch (error) {
      console.error('Sepet güncellenirken hata:', error);
    }
  };

  const clearCart = async () => {
    try {
      // Eğer kullanıcı giriş yapmışsa backend'i temizle
      if (isAuthenticated && user) {
        try {
          await cartAPI.clearCart();
        } catch (error) {
          console.error('Backend temizlenirken hata:', error);
        }
      }

      // Her durumda localStorage'ı temizle
      setCart([]);
      storage.set('cart', []);
    } catch (error) {
      console.error('Sepet temizlenirken hata:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


