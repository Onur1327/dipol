import { useState } from 'react';
import { Link } from 'react-router-dom';
import SizeChartModal from './SizeChartModal';

const Footer = () => {
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const toggleSizeChart = () => {
    setSizeChartOpen(!sizeChartOpen);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <h3>DipOL Butik</h3>
              <p>Modern ve şık giyim dünyasına hoş geldiniz. Kaliteli ürünler ve müşteri memnuniyeti önceliğimizdir.</p>
              <div className="footer-social">
                <a href="https://instagram.com/dipolbutik" target="_blank" rel="noopener" className="social-link instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://wa.me/905074143895" target="_blank" rel="noopener" className="social-link whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Hızlı Linkler</h4>
            <ul className="footer-links">
              <li><Link to="/"><i className="fas fa-home"></i> Ana Sayfa</Link></li>
              <li><Link to="/products"><i className="fas fa-shopping-bag"></i> Tüm Ürünler</Link></li>
              <li><Link to="/account#favorites"><i className="fas fa-heart"></i> Favorilerim</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); toggleSizeChart(); }}><i className="fas fa-ruler"></i> Beden Tablosu</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>İletişim</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <span className="contact-label">Telefon</span>
                  <span className="contact-value">05074143895</span>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <span className="contact-label">E-posta</span>
                  <span className="contact-value">dipolbutik@gmail.com</span>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <span className="contact-label">Adres</span>
                  <span className="contact-value">Güzelyurt Mahallesi, 5781 sokak no:48 B1 Blok Kat 1, Kapı no: 1055 Statü Çarşı Güzelyurt Manisa/Yunusemre, Türkiye</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section footer-map">
            <h4>Konumumuz</h4>
            <div className="map-container">
              <iframe
                title="DipOL Butik Konum"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.215970865343!2d28.977986!3d41.036901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab77a02b1c6b7%3A0x1df8a0e2de5c5b5b!2sTaksim%20Meydan%C4%B1!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 DipOL Butik. Tüm hakları saklıdır.</p>
            <div className="footer-bottom-links">
              <a href="#">Gizlilik Politikası</a>
              <a href="#">Kullanım Şartları</a>
              <a href="#">İade ve Değişim</a>
            </div>
          </div>
        </div>
      </div>
      {sizeChartOpen && <SizeChartModal onClose={toggleSizeChart} />}
    </footer>
  );
};

export default Footer;

