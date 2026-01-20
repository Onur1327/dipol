import { useState } from 'react';

const OrderForm = ({ user, onSubmit, onCancel }) => {
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Telefon numarası zorunludur.';
    } else if (!/^0[5][0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (05xx xxx xx xx).';
    }

    if (!address.trim()) {
      newErrors.address = 'Adres bilgisi zorunludur.';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Adres en az 10 karakter olmalıdır.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(phone.trim(), address.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <div className="form-group">
        <label>Telefon Numarası *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          placeholder="05xx xxx xx xx"
          required
          style={{
            borderColor: errors.phone ? '#ef4444' : 'var(--border-color)'
          }}
        />
        {errors.phone && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '0.25rem' }}>
            {errors.phone}
          </small>
        )}
      </div>

      <div className="form-group">
        <label>Teslimat Adresi *</label>
        <textarea
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (errors.address) setErrors({ ...errors, address: '' });
          }}
          placeholder="Mahalle, Sokak, Bina No, Daire No, İlçe, İl"
          rows="4"
          required
          style={{
            borderColor: errors.address ? '#ef4444' : 'var(--border-color)'
          }}
        ></textarea>
        {errors.address && (
          <small style={{ color: '#ef4444', display: 'block', marginTop: '0.25rem' }}>
            {errors.address}
          </small>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: '1rem' }}>
        <button className="btn-primary" type="submit">
          <i className="fas fa-check"></i> Siparişi Onayla
        </button>
        {onCancel && (
          <button className="btn-secondary" type="button" onClick={onCancel}>
            <i className="fas fa-times"></i> İptal
          </button>
        )}
      </div>
    </form>
  );
};

export default OrderForm;

