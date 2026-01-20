import { useEffect } from 'react';
import { useUsers } from '../../context/UsersContext';

const UserManagement = () => {
  const { users, deleteUser, loadUsers } = useUsers();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (email) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      deleteUser(email);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Bilinmiyor';
    return new Date(timestamp).toLocaleDateString('tr-TR');
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Kullanıcı Yönetimi</h2>
        <div>
          <strong>Toplam Kullanıcı: {users.length}</strong>
        </div>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  Henüz kullanıcı yok.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.email}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user._id || user.email)}
                        title="Sil"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

