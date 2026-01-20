import { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within UsersProvider');
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const data = await usersAPI.delete(id);
      if (data.success) {
        await loadUsers();
      } else {
        throw new Error(data.message || 'Kullanıcı silinemedi');
      }
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      throw error;
    }
  };

  const getUserStats = async () => {
    try {
      const data = await usersAPI.getStats();
      if (data.success) {
        return data.stats;
      }
      return {
        total: users.length,
        recent: 0
      };
    } catch (error) {
      console.error('Kullanıcı istatistikleri yüklenirken hata:', error);
      return {
        total: users.length,
        recent: 0
      };
    }
  };

  const value = {
    users,
    loading,
    loadUsers,
    deleteUser,
    getUserStats
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};
