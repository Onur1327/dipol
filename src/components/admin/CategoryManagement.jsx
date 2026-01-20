import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'fas fa-tag',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  });

  const predefinedColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

  const commonIcons = [
    'fas fa-tag', 'fas fa-star', 'fas fa-tshirt', 'fas fa-person-dress',
    'fas fa-gem', 'fas fa-fire', 'fas fa-percent', 'fas fa-shopping-bag',
    'fas fa-heart', 'fas fa-crown', 'fas fa-gift', 'fas fa-socks'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.slug) {
      formData.slug = formData.name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    if (editingCategory) {
      updateCategory(editingCategory._id || editingCategory.id, formData);
      alert('Kategori güncellendi!');
    } else {
      addCategory(formData);
      alert('Kategori eklendi!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      icon: 'fas fa-tag',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      color: category.color
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Kategori Yönetimi</h2>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="fas fa-plus"></i> Yeni Kategori Ekle
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Kategori Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Slug (URL) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Otomatik oluşturulur"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>İkon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={formData.icon === icon ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <i className={icon}></i>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              style={{ marginTop: '0.5rem' }}
              placeholder="Font Awesome icon class"
            />
          </div>

          <div className="form-group">
            <label>Renk</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    border: formData.color === color ? '3px solid var(--primary-color)' : '2px solid var(--border-color)',
                    background: color,
                    cursor: 'pointer'
                  }}
                ></button>
              ))}
            </div>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              style={{ marginTop: '0.5rem' }}
              placeholder="CSS gradient veya renk kodu"
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">
              <i className="fas fa-save"></i> {editingCategory ? 'Güncelle' : 'Kaydet'}
            </button>
            <button className="btn-secondary" type="button" onClick={resetForm}>
              <i className="fas fa-times"></i> İptal
            </button>
          </div>
        </form>
      )}

      <div className="category-management-grid">
        {categories.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
            Henüz kategori yok.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id || cat.id} className="category-management-card">
              <button
                className="category-delete"
                onClick={() => handleDelete(cat._id || cat.id)}
                title="Sil"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="category-icon" style={{ background: cat.color }}>
                <i className={cat.icon}></i>
              </div>
              <h3>{cat.name}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Slug: {cat.slug}</p>
              <button
                className="btn-edit"
                onClick={() => handleEdit(cat)}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <i className="fas fa-edit"></i> Düzenle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;

