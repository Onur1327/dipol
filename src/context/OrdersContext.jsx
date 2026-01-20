import { createContext, useContext, useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (cartItems, userInfo, total, address, phone) => {
    try {
      if (!address || !address.trim()) {
        throw new Error('Adres bilgisi zorunludur.');
      }
      
      if (!phone || !phone.trim()) {
        throw new Error('Telefon numarası zorunludur.');
      }

      // Cart items'ı API formatına çevir
      const items = cartItems.map(item => ({
        productId: item.product._id || item.product.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }));

      const data = await ordersAPI.create({
        items,
        address,
        phone
      });

      if (data.success) {
        await loadOrders();
        return data.order;
      }
      throw new Error(data.message || 'Sipariş oluşturulamadı');
    } catch (error) {
      console.error('Sipariş oluşturulurken hata:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const data = await ordersAPI.updateStatus(orderId, status);
      if (data.success) {
        await loadOrders();
        return data.order;
      }
      throw new Error(data.message || 'Sipariş durumu güncellenemedi');
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const data = await ordersAPI.delete(orderId);
      if (data.success) {
        await loadOrders();
      } else {
        throw new Error(data.message || 'Sipariş silinemedi');
      }
    } catch (error) {
      console.error('Sipariş silinirken hata:', error);
      throw error;
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId || order.id === orderId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByUser = async (userEmail) => {
    try {
      const data = await ordersAPI.getMyOrders();
      if (data.success) {
        return data.orders || [];
      }
      return [];
    } catch (error) {
      console.error('Kullanıcı siparişleri yüklenirken hata:', error);
      return orders.filter(order => order.userInfo?.email === userEmail);
    }
  };

  const getOrderStats = async () => {
    try {
      const data = await ordersAPI.getStats();
      if (data.success) {
        return data.stats;
      }
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.total, 0)
      };
    } catch (error) {
      console.error('Sipariş istatistikleri yüklenirken hata:', error);
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.total, 0)
      };
    }
  };

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByUser,
    getOrderStats,
    loadOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
