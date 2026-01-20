import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('AuthContext - Token kontrolü:', token ? 'Token var' : 'Token yok');
      if (token) {
        const data = await authAPI.getMe();
        console.log('AuthContext - getMe yanıtı:', data);
        if (data.success) {
          setUser(data.user);
          console.log('AuthContext - Kullanıcı ayarlandı:', data.user);
        } else {
          console.log('AuthContext - getMe başarısız:', data.message);
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Oturum yüklenirken hata:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
      console.log('AuthContext - Loading tamamlandı');
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Giriş başarısız.' };
    } catch (error) {
      return { success: false, message: error.message || 'Bir hata oluştu.' };
    }
  };

  const register = async (name, email, password, phone, address) => {
    try {
      const data = await authAPI.register({ name, email, password, phone, address });
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Kayıt başarısız.' };
    } catch (error) {
      return { success: false, message: error.message || 'Bir hata oluştu.' };
    }
  };

  const logout = () => {
    try {
      authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
