# 🛍️ DipOL Butik - React + Vite

Modern e-ticaret butik sitesi, React ve Vite ile yeniden geliştirilmiştir.

## ✨ Özellikler

- ⚛️ **React 19** - Modern React hooks ve Context API
- ⚡ **Vite** - Hızlı geliştirme ve build
- 🎨 **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- 🛒 **Sepet Sistemi** - LocalStorage tabanlı sepet yönetimi
- ❤️ **Favoriler** - Ürünleri favorilere ekleme/çıkarma
- 👤 **Kullanıcı Yönetimi** - Kayıt, giriş, profil yönetimi
- 📦 **Ürün Yönetimi** - Admin panel ile ürün ekleme/düzenleme/silme
- 🔍 **Arama ve Filtreleme** - Gelişmiş ürün arama ve filtreleme
- 🎯 **Kategori Yönetimi** - Kategori bazlı ürün gösterimi

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (port 3001)
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## 📁 Proje Yapısı

```
src/
├── components/       # React bileşenleri
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartModal.jsx
│   └── ...
├── pages/           # Sayfa bileşenleri
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Account.jsx
│   └── Admin.jsx
├── context/         # Context API (State Management)
│   ├── ProductsContext.jsx
│   ├── CartContext.jsx
│   ├── FavoritesContext.jsx
│   └── AuthContext.jsx
├── utils/           # Yardımcı fonksiyonlar
│   └── storage.js
└── assets/          # Statik dosyalar
    └── css/
        └── style.css
```

## 🎯 Kullanım

### Ürün Ekleme (Admin Panel)
1. `/admin` sayfasına gidin
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Ürün bilgilerini doldurun
4. Kaydet

### Sepete Ürün Ekleme
1. Ürün kartına tıklayın veya "Sepete Ekle" butonuna basın
2. Ürün detayında beden ve renk seçin
3. Miktar belirleyin
4. "Sepete Ekle" butonuna tıklayın

### Favorilere Ekleme
1. Ürün kartında kalp ikonuna tıklayın
2. Veya ürün detay sayfasında favori butonuna tıklayın

## 🛠️ Teknolojiler

- **React 19** - UI kütüphanesi
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Context API** - State management
- **LocalStorage** - Veri saklama
- **Font Awesome** - İkonlar
- **CSS3** - Stil ve animasyonlar

## 📱 Responsive Tasarım

Site tüm cihazlarda mükemmel çalışır:
- 📱 Mobil (< 480px)
- 📱 Tablet (480px - 768px)
- 💻 Laptop (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔧 Geliştirme

### Yeni Component Ekleme
```jsx
// src/components/MyComponent.jsx
const MyComponent = () => {
  return <div>My Component</div>;
};

export default MyComponent;
```

### Context Kullanımı
```jsx
import { useProducts } from '../context/ProductsContext';

const MyComponent = () => {
  const { products, addProduct } = useProducts();
  // ...
};
```

## 📝 Notlar

- Tüm veriler LocalStorage'da saklanır
- Production build için: `npm run build`
- Geliştirme sunucusu port 3001'de çalışır

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

**Geliştirici Notu:** Bu proje modern React standartları ve en iyi pratikler kullanılarak geliştirilmiştir.
