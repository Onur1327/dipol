import { useState } from 'react';

const SizeColorManager = ({ type, items, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const standardColors = ['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Pembe', 'Mor', 'Gri', 'Bej', 'Kahverengi', 'Lacivert'];

  const handleAdd = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (item) => {
    onChange(items.filter(i => i !== item));
  };

  const handleQuickAdd = (item) => {
    if (!items.includes(item)) {
      onChange([...items, item]);
    }
  };

  const standardItems = type === 'sizes' ? standardSizes : standardColors;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={type === 'sizes' ? 'Beden ekle (örn: S, M, L)' : 'Renk ekle (örn: Kırmızı)'}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={handleAdd}
        >
          <i className="fas fa-plus"></i> Ekle
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', display: 'block' }}>
          Hızlı Ekle ({type === 'sizes' ? 'Standart Bedenler' : 'Standart Renkler'}):
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {standardItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickAdd(item)}
              disabled={items.includes(item)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: items.includes(item) ? 'var(--primary-color)' : 'var(--bg-white)',
                color: items.includes(item) ? 'white' : 'var(--text-dark)',
                cursor: items.includes(item) ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', display: 'block' }}>
            Seçili {type === 'sizes' ? 'Bedenler' : 'Renkler'}:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: type === 'colors' ? item.toLowerCase() : 'var(--bg-light)',
                  color: type === 'colors' ? (['Siyah', 'Mavi', 'Lacivert', 'Kahverengi'].includes(item) ? 'white' : 'black') : 'var(--text-dark)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    padding: '0.25rem',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-times" style={{ fontSize: '0.75rem' }}></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeColorManager;

