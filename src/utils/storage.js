// LocalStorage yardımcı fonksiyonları

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Örnek ürün verileri
export const sampleProducts = [
  {
    id: 1,
    name: "Zarif Bluz",
    category: "ust-giyim",
    price: 299.90,
    oldPrice: 399.90,
    description: "Şık ve rahat kesim bluz, günlük kullanım için ideal.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop"],
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beyaz", "Siyah", "Mavi"],
    isNew: true,
    isDiscounted: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 gün önce
  },
  {
    id: 2,
    name: "Şık Pantolon",
    category: "alt-giyim",
    price: 349.90,
    description: "Yüksek bel şık pantolon, ofis ve günlük kombinler için.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop"],
    stock: 20,
    sizes: ["S", "M", "L"],
    colors: ["Siyah", "Lacivert", "Gri"],
    isNew: true,
    isDiscounted: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id: 3,
    name: "Tasarım Kolye",
    category: "taki",
    price: 199.90,
    oldPrice: 299.90,
    description: "Özel tasarım altın kaplama kolye.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"],
    stock: 30,
    sizes: ["ONESIZE"],
    colors: ["Altın", "Gümüş"],
    isNew: false,
    isDiscounted: true,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000
  },
  {
    id: 4,
    name: "Aromaterapi Mum",
    category: "mum",
    price: 149.90,
    description: "El yapımı lavanta kokulu aromaterapi mumu.",
    image: "https://images.unsplash.com/photo-1602874801006-55a96c276c9c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1602874801006-55a96c276c9c?w=400&h=400&fit=crop"],
    stock: 25,
    sizes: ["ONESIZE"],
    colors: ["Mor", "Pembe", "Beyaz"],
    isNew: true,
    isDiscounted: false,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    id: 5,
    name: "Deri Ceket",
    category: "ust-giyim",
    price: 799.90,
    oldPrice: 999.90,
    description: "Hakiki deri şık ceket, sonbahar ve kış için ideal.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"],
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Siyah", "Kahverengi"],
    isNew: true,
    isDiscounted: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 6,
    name: "Etek",
    category: "alt-giyim",
    price: 249.90,
    description: "Midi boy şık etek, her kombine uygun.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop"],
    stock: 18,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Siyah", "Beyaz", "Kırmızı"],
    isNew: false,
    isDiscounted: false,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000
  },
  {
    id: 7,
    name: "Gümüş Bileklik",
    category: "taki",
    price: 299.90,
    oldPrice: 399.90,
    description: "925 ayar gümüş şık bileklik.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"],
    stock: 12,
    sizes: ["ONESIZE"],
    colors: ["Gümüş"],
    isNew: true,
    isDiscounted: true,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id: 8,
    name: "Vanilya Mum Seti",
    category: "mum",
    price: 249.90,
    description: "3'lü vanilya kokulu mum seti, hediyelik.",
    image: "https://images.unsplash.com/photo-1602874801006-e26d9bc2f9bc?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1602874801006-e26d9bc2f9bc?w=400&h=400&fit=crop"],
    stock: 15,
    sizes: ["ONESIZE"],
    colors: ["Krem", "Beyaz"],
    isNew: false,
    isDiscounted: false,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 9,
    name: "Şık Trençkot",
    category: "dis-giyim",
    price: 599.90,
    oldPrice: 799.90,
    description: "Klasik kesim şık trençkot, yağmurlu günler için ideal.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop"],
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bej", "Siyah", "Navy"],
    isNew: true,
    isDiscounted: true,
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000
  }
];

// Varsayılan kategoriler
export const defaultCategories = [
  { id: 1, name: 'Yeni Gelenler', slug: 'yeni-gelenler', icon: 'fas fa-star', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: 'Üst Giyim', slug: 'ust-giyim', icon: 'fas fa-tshirt', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: 'Alt Giyim', slug: 'alt-giyim', icon: 'fas fa-person-dress', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: 'Takı', slug: 'taki', icon: 'fas fa-gem', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, name: 'Mum', slug: 'mum', icon: 'fas fa-fire', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, name: 'İndirimli Ürünler', slug: 'indirimli', icon: 'fas fa-percent', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
];

// LocalStorage'ı başlat
export const initializeStorage = () => {
  if (!storage.get('products')) {
    storage.set('products', sampleProducts);
  }
  if (!storage.get('cart')) {
    storage.set('cart', []);
  }
  if (!storage.get('favorites')) {
    storage.set('favorites', []);
  }
  if (!storage.get('categories')) {
    storage.set('categories', defaultCategories);
  }
  if (!storage.get('users')) {
    storage.set('users', []);
  }
};

// Fiyat formatla
export const formatPrice = (value) => {
  if (typeof value !== 'number') return value;
  return value.toFixed(2) + '₺';
};

// 14 gün kuralına göre isNew alanını güncelle
export const refreshNewFlags = (products) => {
  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  
  return products.map(p => {
    if (p.createdAt) {
      const shouldBeNew = now - p.createdAt < fourteenDaysMs;
      return { ...p, isNew: shouldBeNew };
    }
    return p;
  });
};

// Müşteriye gösterilecek ürünleri filtrele (1 ay kuralı)
export const getVisibleProducts = (products) => {
  const now = Date.now();
  const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
  
  return products.filter(p => {
    if (p.stock > 0) return true;
    if (p.stock === 0 && p.outOfStockDate) {
      return now - p.outOfStockDate < oneMonthMs;
    }
    return false;
  });
};

