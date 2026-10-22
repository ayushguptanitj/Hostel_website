import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchHomeData,
  saveHomeData,
  resetHomeData,
  exportHomeDataJSON,
} from '../utils/homeDataManager';
import {
  logoutAdmin,
  changeAdminPassword,
  HOSTEL_CONFIGS,
} from '../utils/hostelDataManager';
import ImageUploadField from './ImageUploadField';
import './Admin.css';

const MAIN_TABS = [
  { id: 'hero', label: 'Hero Banner', icon: '🏠' },
  { id: 'features', label: 'Why Choose NITJ', icon: '🌟' },
  { id: 'stats', label: 'Key Statistics', icon: '📊' },
  { id: 'director', label: "Director's Message", icon: '🎓' },
  { id: 'dsw', label: 'DSW Message', icon: '🤝' },
  { id: 'chiefWarden', label: 'Associate Dean Hostel Message', icon: '👨‍🏫' },
  { id: 'hostels', label: 'All Hostels Hub', icon: '🏢' },
  { id: 'security', label: 'Security & Password', icon: '🔒' },
];

const MainAdminDashboard = ({ onLogout, onSwitchToHostel }) => {
  const [activeTab, setActiveTab] = useState('hero');
  const [homeData, setHomeData] = useState(null);
  const [toast, setToast] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Security state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchHomeData();
    setHomeData(data);
    setHasChanges(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleNestedChange = (section, field, value) => {
    setHomeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleArrayItemChange = (section, index, field, value) => {
    setHomeData((prev) => {
      const items = [...prev[section]];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        [section]: items,
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!homeData || isSaving) return;
    setIsSaving(true);
    const res = await saveHomeData(homeData);
    setIsSaving(false);
    if (res.success) {
      setHasChanges(false);
      showToast('✅ Homepage content saved successfully! Public site updated.');
    } else {
      showToast(`❌ Failed to save changes: ${res.message}`);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset the homepage content to original defaults? Custom edits will be removed.'
      )
    ) {
      const def = await resetHomeData();
      if (!def) {
        showToast('❌ Failed to reset content.');
        return;
      }
      setHomeData(def);
      setHasChanges(false);
      showToast('🔄 Homepage reset to original defaults.');
    }
  };

  const handleExport = () => {
    const jsonStr = exportHomeDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'homepage_content.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Homepage content JSON exported.');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSecurityMsg({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    const res = await changeAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setSecurityMsg({ text: res.message, type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('🔑 Main Admin password updated successfully!');
    } else {
      setSecurityMsg({ text: res.message, type: 'error' });
    }
  };

  if (!homeData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading homepage data...</div>;
  }

  return (
    <div className="admin-page-wrap">
      {/* ── Top Header ── */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
              MAIN
            </div>
            <div className="admin-brand-info">
              <h2>Main Website (Homepage) Admin</h2>
              <span className="admin-hostel-tag" style={{ background: '#fef3c7', color: '#92400e' }}>
                Admin ID: admin_main (Super Admin)
              </span>
            </div>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="Open public homepage in a new tab"
            >
              👁️ View Live Homepage
            </Link>

            <button
              onClick={handleExport}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="Export content as JSON"
            >
              📥 Export JSON
            </button>

            <button
              onClick={handleReset}
              className="admin-btn admin-btn-danger admin-btn-sm"
              title="Reset homepage to default content"
            >
              🔄 Reset Defaults
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                if (onLogout) onLogout();
              }}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="admin-main">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          {MAIN_TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Hero Banner ── */}
        {activeTab === 'hero' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🏠 Homepage Hero Section</h3>
                <p>Edit the main hero banner text and background appearance.</p>
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Welcome Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.hero?.welcome || ''}
                  onChange={(e) => handleNestedChange('hero', 'welcome', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Main Title Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.hero?.title || ''}
                  onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Hero Subtitle / Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={homeData.hero?.subtitle || ''}
                onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Explore Button Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.hero?.exploreBtnText || ''}
                  onChange={(e) => handleNestedChange('hero', 'exploreBtnText', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Custom Hero Background Image (optional)</label>
                <ImageUploadField
                  placeholder="Leave empty to use default NITJ Mega Hostel image"
                  value={homeData.hero?.bgImage}
                  onChange={(url) => handleNestedChange('hero', 'bgImage', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Why Choose NITJ (Features) ── */}
        {activeTab === 'features' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🌟 Why Choose NITJ Hostels? (Feature Highlights)</h3>
                <p>Edit the four main promotional feature cards on the homepage.</p>
              </div>
            </div>

            <div className="admin-cards-grid">
              {homeData.features?.map((feat, idx) => (
                <div key={idx} className="admin-item-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    <i className={feat.icon || 'fas fa-star'}></i>
                  </span>
                  <div className="admin-form-group">
                    <label>Card {idx + 1} Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={feat.title}
                      onChange={(e) => handleArrayItemChange('features', idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => handleArrayItemChange('features', idx, 'desc', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>FontAwesome Icon Class</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={feat.icon}
                      onChange={(e) => handleArrayItemChange('features', idx, 'icon', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 3: Key Statistics ── */}
        {activeTab === 'stats' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>📊 Key Statistics Counter</h3>
                <p>Configure the milestone statistics highlighted on the homepage.</p>
              </div>
            </div>

            <div className="admin-grid-2">
              {homeData.stats?.map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#f8fafc',
                  }}
                >
                  <div className="admin-form-group">
                    <label>Stat {idx + 1} Number / Value</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={st.number}
                      onChange={(e) => handleArrayItemChange('stats', idx, 'number', e.target.value)}
                      placeholder="e.g. 5000+"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Stat Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={st.label}
                      onChange={(e) => handleArrayItemChange('stats', idx, 'label', e.target.value)}
                      placeholder="e.g. Happy Students"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 4: Director's Message ── */}
        {activeTab === 'director' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🎓 Message from the Director</h3>
                <p>Update Director name, designation, photo, and official welcome address.</p>
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Director Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.director?.name || ''}
                  onChange={(e) => handleNestedChange('director', 'name', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Designation Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.director?.title || ''}
                  onChange={(e) => handleNestedChange('director', 'title', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Custom Photograph (optional)</label>
              <ImageUploadField
                placeholder="Leave empty to use default Director photograph"
                value={homeData.director?.image}
                onChange={(url) => handleNestedChange('director', 'image', url)}
              />
            </div>

            <div className="admin-form-group">
              <label>Director's Message (Separate paragraphs with double Enter / new line)</label>
              <textarea
                className="admin-textarea"
                rows={8}
                value={
                  Array.isArray(homeData.director?.messageParagraphs)
                    ? homeData.director.messageParagraphs.join('\n\n')
                    : homeData.director?.message || ''
                }
                onChange={(e) => {
                  const paras = e.target.value.split('\n\n').filter((p) => p.trim().length > 0);
                  handleNestedChange('director', 'messageParagraphs', paras);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Tab 5: DSW Message ── */}
        {activeTab === 'dsw' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🤝 Message from Dean Student Welfare (DSW)</h3>
                <p>Update DSW name, designation, photo, and welcome address.</p>
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Dean Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.dsw?.name || ''}
                  onChange={(e) => handleNestedChange('dsw', 'name', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Designation Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.dsw?.title || ''}
                  onChange={(e) => handleNestedChange('dsw', 'title', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Custom Photograph (optional)</label>
              <ImageUploadField
                placeholder="Leave empty to use default DSW photograph"
                value={homeData.dsw?.image}
                onChange={(url) => handleNestedChange('dsw', 'image', url)}
              />
            </div>

            <div className="admin-form-group">
              <label>DSW's Message (Separate paragraphs with double Enter / new line)</label>
              <textarea
                className="admin-textarea"
                rows={8}
                value={
                  Array.isArray(homeData.dsw?.messageParagraphs)
                    ? homeData.dsw.messageParagraphs.join('\n\n')
                    : homeData.dsw?.message || ''
                }
                onChange={(e) => {
                  const paras = e.target.value.split('\n\n').filter((p) => p.trim().length > 0);
                  handleNestedChange('dsw', 'messageParagraphs', paras);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Tab 6: Associate Dean Hostel Message ── */}
        {activeTab === 'chiefWarden' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>👨‍🏫 Message from Associate Dean Hostel</h3>
                <p>Update Associate Dean Hostel name, designation, photo, and message.</p>
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Associate Dean Hostel Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.chiefWarden?.name || ''}
                  onChange={(e) => handleNestedChange('chiefWarden', 'name', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Designation Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={homeData.chiefWarden?.title || ''}
                  onChange={(e) => handleNestedChange('chiefWarden', 'title', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Custom Photograph (optional)</label>
              <ImageUploadField
                placeholder="Leave empty to use default Associate Dean Hostel photograph"
                value={homeData.chiefWarden?.image}
                onChange={(url) => handleNestedChange('chiefWarden', 'image', url)}
              />
            </div>

            <div className="admin-form-group">
              <label>Associate Dean Hostel's Message (Separate paragraphs with double Enter / new line)</label>
              <textarea
                className="admin-textarea"
                rows={8}
                value={
                  Array.isArray(homeData.chiefWarden?.messageParagraphs)
                    ? homeData.chiefWarden.messageParagraphs.join('\n\n')
                    : homeData.chiefWarden?.message || ''
                }
                onChange={(e) => {
                  const paras = e.target.value.split('\n\n').filter((p) => p.trim().length > 0);
                  handleNestedChange('chiefWarden', 'messageParagraphs', paras);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Tab 7: Hostels Hub (Super Admin shortcut) ── */}
        {activeTab === 'hostels' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🏢 All Hostels Control Hub</h3>
                <p>Super Admin overview: quickly inspect or switch to manage any individual hostel.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hostel Name</th>
                    <th>Hostel Key</th>
                    <th>Admin Login ID</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {HOSTEL_CONFIGS.map((h) => (
                    <tr key={h.key}>
                      <td><strong>{h.name}</strong></td>
                      <td><code>{h.key}</code></td>
                      <td><code>{h.loginId}</code></td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/${h.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          style={{ marginRight: '0.4rem' }}
                        >
                          👁️ View
                        </Link>
                        {onSwitchToHostel && (
                          <button
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => onSwitchToHostel(h.key)}
                          >
                            ✏️ Edit Hostel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 8: Security & Password ── */}
        {activeTab === 'security' && (
          <div className="admin-content-card" style={{ maxWidth: '600px' }}>
            <div className="admin-card-header">
              <div>
                <h3>🔒 Change Main Website Admin Password</h3>
                <p>Update password for Main Website Admin (admin_main).</p>
              </div>
            </div>

            {securityMsg.text && (
              <div
                className={`admin-alert ${
                  securityMsg.type === 'error' ? 'admin-alert-error' : 'admin-alert-success'
                }`}
              >
                {securityMsg.type === 'error' ? '⚠️' : '✅'} {securityMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="admin-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                Update Main Admin Password
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── Sticky Save Action Bar ── */}
      <div className="admin-sticky-bar">
        <div className="admin-sticky-bar-text">
          {hasChanges ? (
            <span style={{ color: 'var(--admin-warning)' }}>● You have unsaved changes</span>
          ) : (
            <span style={{ color: 'var(--admin-success)' }}>✓ All changes up to date</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {hasChanges && (
            <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={loadData}>
              Discard
            </button>
          )}
          <button className="admin-btn admin-btn-success admin-btn-sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
};

export default MainAdminDashboard;
