import { useState, useRef } from 'react';

const ImageUpload = ({ images, onImagesChange }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImagesChange([...images, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setPrimary = (index) => {
    const newImages = [...images];
    const [primary] = newImages.splice(index, 1);
    newImages.unshift(primary);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div
        className={`image-upload-area ${dragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(102, 126, 234, 0.1)' : 'var(--bg-light)',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
          Görselleri sürükleyip bırakın veya tıklayarak seçin
        </p>
        <small style={{ color: 'var(--text-light)' }}>
          PNG, JPG, GIF formatları desteklenir
        </small>
      </div>

      {images.length > 0 && (
        <div className="image-preview-container" style={{ marginTop: '1.5rem' }}>
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={image} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-image"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
              {index === 0 ? (
                <button
                  type="button"
                  className="set-primary primary"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  ✓ Ana Görsel
                </button>
              ) : (
                <button
                  type="button"
                  className="set-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrimary(index);
                  }}
                >
                  Ana Görsel Yap
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

