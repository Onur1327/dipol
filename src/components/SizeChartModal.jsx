const SizeChartModal = ({ onClose }) => {
  return (
    <div id="sizeChartModal" className="modal active" onClick={(e) => {
      if (e.target.id === 'sizeChartModal') onClose();
    }}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Beden Tablosu</h2>
          <button onClick={onClose} type="button">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <table className="size-chart-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-light)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>Beden</th>
                <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>Göğüs (cm)</th>
                <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>Bel (cm)</th>
                <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>Kalça (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>XS</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>80-84</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>60-64</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>86-90</td>
              </tr>
              <tr style={{ background: 'var(--bg-light)' }}>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>S</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>84-88</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>64-68</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>90-94</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>M</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>88-92</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>68-72</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>94-98</td>
              </tr>
              <tr style={{ background: 'var(--bg-light)' }}>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>L</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>92-96</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>72-76</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>98-102</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>XL</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>96-100</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>76-80</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>102-106</td>
              </tr>
              <tr style={{ background: 'var(--bg-light)' }}>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: '600' }}>XXL</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>100-104</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>80-84</td>
                <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>106-110</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
              <strong>Not:</strong> Beden ölçüleri yaklaşık değerlerdir. Ürünlerin kumaş ve kesim özelliklerine göre değişiklik gösterebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;

