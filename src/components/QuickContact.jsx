const QuickContact = () => {
  return (
    <div className="quick-contact">
      <a
        className="qc-btn qc-wa"
        href="https://wa.me/905074143895"
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp ile iletişime geç"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
      <a
        className="qc-btn qc-ig"
        href="https://instagram.com/dipolbutik"
        target="_blank"
        rel="noopener"
        aria-label="Instagram sayfamız"
      >
        <i className="fab fa-instagram"></i>
      </a>
    </div>
  );
};

export default QuickContact;

