import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';
import { useUsers } from '../../context/UsersContext';
import { formatPrice } from '../../utils/storage';

const Dashboard = () => {
  const { getProductStats } = useProducts();
  const { getOrderStats } = useOrders();
  const { getUserStats } = useUsers();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [productStats, orderStats, userStats] = await Promise.all([
        getProductStats().catch(err => {
          console.error('Ürün istatistikleri yüklenirken hata:', err);
          return { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 };
        }),
        getOrderStats().catch(err => {
          console.error('Sipariş istatistikleri yüklenirken hata:', err);
          return { total: 0, pending: 0, totalRevenue: 0 };
        }),
        getUserStats().catch(err => {
          console.error('Kullanıcı istatistikleri yüklenirken hata:', err);
          return { total: 0 };
        })
      ]);

      setStats([
        {
          title: 'Toplam Ürün',
          value: productStats?.total || 0,
          icon: 'fas fa-box',
          color: '#667eea'
        },
        {
          title: 'Stokta Olan',
          value: productStats?.inStock || 0,
          icon: 'fas fa-check-circle',
          color: '#10b981'
        },
        {
          title: 'Stokta Olmayan',
          value: productStats?.outOfStock || 0,
          icon: 'fas fa-times-circle',
          color: '#ef4444'
        },
        {
          title: 'Düşük Stok',
          value: productStats?.lowStock || 0,
          icon: 'fas fa-exclamation-triangle',
          color: '#f59e0b'
        },
        {
          title: 'Toplam Sipariş',
          value: orderStats?.total || 0,
          icon: 'fas fa-shopping-cart',
          color: '#3b82f6'
        },
        {
          title: 'Bekleyen Siparişler',
          value: orderStats?.pending || 0,
          icon: 'fas fa-clock',
          color: '#f59e0b'
        },
        {
          title: 'Toplam Gelir',
          value: formatPrice(orderStats?.totalRevenue || 0),
          icon: 'fas fa-lira-sign',
          color: '#10b981'
        },
        {
          title: 'Toplam Kullanıcı',
          value: userStats?.total || 0,
          icon: 'fas fa-users',
          color: '#8b5cf6'
        }
      ]);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
