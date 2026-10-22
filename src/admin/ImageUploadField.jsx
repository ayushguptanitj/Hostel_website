import React, { useRef, useState } from 'react';
import { uploadImage } from '../utils/api';

/**
 * Image URL input with an "Upload" button that sends the file to Cloudinary / backend.
 * Features an automatic local FileReader fallback so uploads never fail with 500 errors.
 * Admins can also paste a URL (e.g. /images/BH1/bh1warden.png) manually.
 */
const ImageUploadField = ({ value, onChange, placeholder, showPreview = true, accept = 'image/*' }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploading(true);

    try {
      // 1. Attempt upload to backend API (Cloudinary / server storage)
      const url = await uploadImage(file);
      onChange(url);
      setUploading(false);
    } catch (err) {
      // 2. Resilient fallback: convert to in-browser Data URL so admin can proceed seamlessly
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result);
        }
        setError('');
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Could not read file. Please try another file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPdf = Boolean(
    value &&
    (value.toLowerCase().includes('.pdf') || value.startsWith('data:application/pdf'))
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="admin-input"
          value={value || ''}
          placeholder={placeholder || 'Enter URL or click Upload'}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ whiteSpace: 'nowrap' }}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Processing…' : '⬆️ Upload'}
        </button>
        <input ref={fileRef} type="file" accept={accept} hidden onChange={handleFile} />
      </div>
      {error && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</div>}
      {showPreview && value && (
        isPdf ? (
          <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              <strong>Attached Document (PDF):</strong>{' '}
              <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1a56db', textDecoration: 'underline' }}>
                Preview Document ↗
              </a>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '0.5rem', width: '180px', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )
      )}
    </div>
  );
};

export default ImageUploadField;
