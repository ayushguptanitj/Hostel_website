import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ALL_PORTAL_CONFIGS,
  loginAdmin,
} from '../utils/hostelDataManager';
import './Admin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const preselectedHostel = searchParams.get('hostel') || '';

  const [selectedHostelKey, setSelectedHostelKey] = useState(preselectedHostel);
  const [customLoginId, setCustomLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (preselectedHostel) {
      setSelectedHostelKey(preselectedHostel);
    }
  }, [preselectedHostel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const identifier = customLoginId.trim() || selectedHostelKey;

    if (!identifier) {
      setErrorMsg('Please select a portal or enter your Login ID.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      setIsLoading(false);
      return;
    }

    const res = await loginAdmin(identifier, password);
    setIsLoading(false);

    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess(res.hostelKey);
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-badge">🏛️</div>
          <h1>NITJ Portal Admin</h1>
          <p>Sign in with your credentials to manage website or hostel content</p>
        </div>

        {errorMsg && (
          <div className="admin-alert admin-alert-error">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Portal / Hostel Quick Select */}
          <div className="admin-form-group">
            <label htmlFor="hostelSelect">Select Website or Hostel</label>
            <select
              id="hostelSelect"
              className="admin-select"
              value={selectedHostelKey}
              onChange={(e) => {
                setSelectedHostelKey(e.target.value);
                setCustomLoginId('');
              }}
            >
              <option value="">-- Choose Portal or Hostel --</option>
              {ALL_PORTAL_CONFIGS.map((h) => (
                <option key={h.key} value={h.key}>
                  {h.key === 'main' ? `★ ${h.name}` : `${h.name} (${h.key})`}
                </option>
              ))}
            </select>
          </div>

          {/* Or manual Login ID */}
          <div className="admin-form-group">
            <label htmlFor="loginId">Or Enter Login ID</label>
            <input
              id="loginId"
              type="text"
              className="admin-input"
              placeholder="e.g. admin_main or admin_bh1"
              value={customLoginId}
              onChange={(e) => {
                setCustomLoginId(e.target.value);
                if (e.target.value) setSelectedHostelKey('');
              }}
            />
          </div>

          {/* Password Input with Forgot Password Option */}
          <div className="admin-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="adminPassword" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                className="admin-forgot-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>
            <div className="admin-input-group">
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-pw-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-full"
            disabled={isLoading}
            style={{ marginTop: '0.75rem' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/">← Back to Public Website</Link>
        </div>
      </div>

      {/* ── Forgot Password Contact Webmaster Modal ── */}
      {showForgotModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>🔒 Password Reset Request</h4>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowForgotModal(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '0.75rem 0 1.25rem' }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>👨‍💻</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--admin-text)', marginBottom: '0.5rem' }}>
                Contact Webmaster for Password Reset
              </h3>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 auto 1.25rem', maxWidth: '420px' }}>
                Self-service password reset is disabled. To reset the administrator password for any hostel portal or the main website, please contact the Webmaster or the Hostel Administration Office.
              </p>
            </div>

            <div className="admin-contact-card" style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
              <div>
                <strong>📧 Webmaster / Tech Support:</strong>{' '}
                <a href="mailto:webmaster@nitj.ac.in">webmaster@nitj.ac.in</a>
              </div>
              <div>
                <strong>🏢 Office of Dean Student Welfare:</strong>{' '}
                <a href="mailto:hostels@nitj.ac.in">hostels@nitj.ac.in</a> / <a href="mailto:dsw@nitj.ac.in">dsw@nitj.ac.in</a>
              </div>
              <div>
                <strong>📞 Intercom Extension:</strong> 1201 / 1202 &nbsp;|&nbsp; <strong>EPABX:</strong> +91-181-5037800
              </div>
              <div>
                <strong>📍 Location:</strong> Student Activity Centre (SAC), Ground Floor, Dr B R Ambedkar NIT Jalandhar
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-full"
                onClick={() => setShowForgotModal(false)}
              >
                Understood / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
