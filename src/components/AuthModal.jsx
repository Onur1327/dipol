import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(loginEmail, loginPassword);
      if (result.success) {
        onClose();
        navigate('/account');
      } else {
        setError(result.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasyon
    if (!regPhone.trim()) {
      setError('Telefon numarası zorunludur.');
      return;
    }
    
    if (!regAddress.trim()) {
      setError('Adres bilgisi zorunludur.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(regName, regEmail, regPassword, regPhone, regAddress);
      if (result.success) {
        onClose();
        navigate('/account');
      } else {
        setError(result.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError(error.message || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="authModal" 
      className="modal active" 
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target.id === 'authModal' || e.target.classList.contains('modal')) {
          onClose();
        }
      }}
    >
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="authTitle">{activeTab === 'login' ? 'Üye Girişi' : 'Kayıt Ol'}</h2>
          <button onClick={onClose} type="button">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="auth-tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <button
              id="loginTabBtn"
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Giriş Yap
            </button>
            <button
              id="registerTabBtn"
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              Kayıt Ol
            </button>
          </div>
          
          {error && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          
          {activeTab === 'login' ? (
            <form id="loginForm" className="admin-form" style={{ padding: 0, boxShadow: 'none', background: 'transparent' }} onSubmit={handleLogin}>
              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Şifre</label>
                <input
                  type="password"
                  id="loginPassword"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                      Giriş yapılıyor...
                    </>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form id="registerForm" className="admin-form" style={{ padding: 0, boxShadow: 'none', background: 'transparent' }} onSubmit={handleRegister}>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  id="regName"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  id="regEmail"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefon *</label>
                <input
                  type="tel"
                  id="regPhone"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  required
                />
              </div>
              <div className="form-group">
                <label>Adres *</label>
                <textarea
                  id="regAddress"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Tam adres bilginizi giriniz"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Şifre</label>
                <input
                  type="password"
                  id="regPassword"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                      Kayıt yapılıyor...
                    </>
                  ) : (
                    'Kayıt Ol'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

