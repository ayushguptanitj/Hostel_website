import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchHostelData,
  saveHostelData,
  resetHostelData,
  exportHostelDataJSON,
  logoutAdmin,
  changeAdminPassword,
  getHostelConfig,
} from '../utils/hostelDataManager';
import ImageUploadField from './ImageUploadField';
import './Admin.css';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'warden', label: 'Warden Message', icon: '👨‍💼' },
  { id: 'mess', label: 'Mess Details', icon: '🍽️' },
  { id: 'facilities', label: 'Facilities', icon: '🏢' },
  { id: 'student-corner', label: 'Student Corner', icon: '📢' },
  { id: 'staff', label: 'Staff & Team', icon: '👥' },
  { id: 'committee', label: 'Committee', icon: '🏛️' },
  { id: 'gallery', label: 'Gallery & Carousel', icon: '🖼️' },
  { id: 'security', label: 'Security & Password', icon: '🔒' },
];

const getTodayFormatted = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const AdminDashboard = ({ hostelKey, onLogout }) => {
  const config = getHostelConfig(hostelKey);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState(null);
  const [toast, setToast] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Security tab state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', type: '' });

  // Modals / Item Editing State
  const [editingFacility, setEditingFacility] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newCarouselImg, setNewCarouselImg] = useState('');

  const handleOpenAddAnnouncement = () => {
    setEditingAnnouncement({
      index: -1,
      title: '',
      date: getTodayFormatted(),
      tag: 'Notice',
      description: '',
      link: '',
      isNew: true,
    });
  };

  useEffect(() => {
    loadData();
  }, [hostelKey]);

  const loadData = async () => {
    const data = await fetchHostelData(hostelKey);
    setFormData(data);
    setHasChanges(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleAddAdditionalWarden = () => {
    setFormData((prev) => {
      const currentWardens = prev.wardens && prev.wardens.length > 0
        ? [...prev.wardens]
        : [
            {
              name: prev.wardenName || '',
              designation: 'Hostel Warden',
              email: prev.wardenEmail || '',
              phone: prev.wardenPhone || '',
              image: prev.wardenImage || '',
            },
          ];

      if (currentWardens.length < 2) {
        currentWardens.push({
          name: '',
          designation: 'Additional Warden',
          email: '',
          phone: '',
          image: '/images/chiefwarden.jpg',
        });
      }

      return {
        ...prev,
        wardens: currentWardens,
      };
    });
    setHasChanges(true);
  };

  const handleRemoveAdditionalWarden = () => {
    setFormData((prev) => {
      const firstWarden = prev.wardens?.[0] || {
        name: prev.wardenName || '',
        designation: 'Hostel Warden',
        email: prev.wardenEmail || '',
        phone: prev.wardenPhone || '',
        image: prev.wardenImage || '',
      };

      return {
        ...prev,
        wardenName: firstWarden.name,
        wardenEmail: firstWarden.email,
        wardenPhone: firstWarden.phone,
        wardenImage: firstWarden.image,
        wardens: null,
      };
    });
    setHasChanges(true);
  };

  const handleWardenFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const wardens = prev.wardens ? [...prev.wardens] : [
        {
          name: prev.wardenName || '',
          designation: 'Hostel Warden',
          email: prev.wardenEmail || '',
          phone: prev.wardenPhone || '',
          image: prev.wardenImage || '',
        }
      ];

      if (!wardens[index]) {
        wardens[index] = {
          name: '',
          designation: index === 0 ? 'Hostel Warden' : 'Additional Warden',
          email: '',
          phone: '',
          image: '',
        };
      }

      wardens[index] = {
        ...wardens[index],
        [field]: value,
      };

      const updated = {
        ...prev,
        wardens,
      };

      if (index === 0) {
        if (field === 'name') updated.wardenName = value;
        if (field === 'email') updated.wardenEmail = value;
        if (field === 'phone') updated.wardenPhone = value;
        if (field === 'image') updated.wardenImage = value;
      }

      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData || isSaving) return;
    setIsSaving(true);
    const res = await saveHostelData(hostelKey, formData);
    setIsSaving(false);
    if (res.success) {
      setHasChanges(false);
      showToast('✅ Changes saved successfully! Public page updated.');
    } else {
      showToast(`❌ Failed to save changes: ${res.message}`);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset this hostel content to initial defaults? Custom edits will be removed.')) {
      const def = await resetHostelData(hostelKey);
      if (!def) {
        showToast('❌ Failed to reset content.');
        return;
      }
      setFormData(def);
      setHasChanges(false);
      showToast('🔄 Content reset to original defaults.');
    }
  };

  const handleExport = () => {
    const jsonStr = exportHostelDataJSON(hostelKey);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hostelKey}_content.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Hostel JSON exported.');
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
      showToast('🔑 Password changed successfully!');
    } else {
      setSecurityMsg({ text: res.message, type: 'error' });
    }
  };

  if (!formData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading hostel details...</div>;
  }

  return (
    <div className="admin-page-wrap">
      {/* ── Top Header ── */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-badge">NITJ</div>
            <div className="admin-brand-info">
              <h2>{formData.name || config?.name}</h2>
              <span className="admin-hostel-tag">Admin ID: {config?.loginId || hostelKey}</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <Link
              to={`/${hostelKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="Open public hostel page in a new tab"
            >
              👁️ View Live Page
            </Link>

            <button
              onClick={handleExport}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="Export content as JSON"
            >
              📥 Export
            </button>

            <button
              onClick={handleReset}
              className="admin-btn admin-btn-danger admin-btn-sm"
              title="Reset to default content"
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
          {TABS.map((t) => (
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

        {/* ── Tab 1: Overview ── */}
        {activeTab === 'overview' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🏠 Overview & Basic Information</h3>
                <p>Edit general hostel details displayed on the homepage and hostel landing section.</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Hostel Display Name</label>
              <input
                type="text"
                className="admin-input"
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>About / Description</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Main About Image</label>
                <ImageUploadField
                  value={formData.image}
                  onChange={(url) => handleFieldChange('image', url)}
                  showPreview={false}
                />
              </div>

              <div className="admin-form-group">
                <label>Contact Details Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.contact || ''}
                  onChange={(e) => handleFieldChange('contact', e.target.value)}
                />
              </div>
            </div>

            {formData.image && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Image Preview:</span>
                <div style={{ marginTop: '0.25rem', width: '180px', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Warden Message ── */}
        {activeTab === 'warden' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>👨‍💼 Warden's Information & Message</h3>
                <p>Update warden contact, official email, photo, and student welcome message.</p>
              </div>
              <div>
                {formData.wardens && formData.wardens.length >= 2 ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={handleRemoveAdditionalWarden}
                  >
                    🗑️ Remove Additional Warden
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={handleAddAdditionalWarden}
                  >
                    ➕ Add Additional Warden
                  </button>
                )}
              </div>
            </div>

            {/* If has multiple wardens, render Primary Warden Card and Additional Warden Card */}
            {formData.wardens && formData.wardens.length >= 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* ── 1. Primary Warden Card ── */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                      👤 Primary Hostel Warden
                    </h4>
                    <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      Hostel Warden
                    </span>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label>Warden Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Dr. Samayveer Singh"
                        value={formData.wardens[0]?.name || formData.wardenName || ''}
                        onChange={(e) => handleWardenFieldChange(0, 'name', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Hostel Warden"
                        value={formData.wardens[0]?.designation || 'Hostel Warden'}
                        onChange={(e) => handleWardenFieldChange(0, 'designation', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Official Email</label>
                      <input
                        type="email"
                        className="admin-input"
                        placeholder="warden@nitj.ac.in"
                        value={formData.wardens[0]?.email || formData.wardenEmail || ''}
                        onChange={(e) => handleWardenFieldChange(0, 'email', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 99357-41966"
                        value={formData.wardens[0]?.phone || formData.wardenPhone || ''}
                        onChange={(e) => handleWardenFieldChange(0, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label>Primary Warden Photograph</label>
                    <ImageUploadField
                      value={formData.wardens[0]?.image || formData.wardenImage}
                      onChange={(url) => handleWardenFieldChange(0, 'image', url)}
                    />
                  </div>
                </div>

                {/* ── 2. Additional Warden Card ── */}
                <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e40af' }}>
                      👥 Additional / Joint Warden
                    </h4>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={handleRemoveAdditionalWarden}
                      title="Remove this additional warden"
                    >
                      🗑️ Remove Additional Warden
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label>Additional Warden Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Dr. Sumit Kumar"
                        value={formData.wardens[1]?.name || ''}
                        onChange={(e) => handleWardenFieldChange(1, 'name', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Additional Warden or Joint Warden"
                        value={formData.wardens[1]?.designation || 'Additional Warden'}
                        onChange={(e) => handleWardenFieldChange(1, 'designation', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Official Email</label>
                      <input
                        type="email"
                        className="admin-input"
                        placeholder="addlwarden@nitj.ac.in"
                        value={formData.wardens[1]?.email || ''}
                        onChange={(e) => handleWardenFieldChange(1, 'email', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 81717-86260"
                        value={formData.wardens[1]?.phone || ''}
                        onChange={(e) => handleWardenFieldChange(1, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label>Additional Warden Photograph</label>
                    <ImageUploadField
                      value={formData.wardens[1]?.image}
                      onChange={(url) => handleWardenFieldChange(1, 'image', url)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Single Warden Form */
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label>Warden Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.wardenName || ''}
                      onChange={(e) => handleFieldChange('wardenName', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Warden Official Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={formData.wardenEmail || ''}
                      onChange={(e) => handleFieldChange('wardenEmail', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Warden Phone Number</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 98881-XXXXX"
                      value={formData.wardenPhone || ''}
                      onChange={(e) => handleFieldChange('wardenPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Warden Photograph</label>
                  <ImageUploadField
                    value={formData.wardenImage}
                    onChange={(url) => handleFieldChange('wardenImage', url)}
                  />
                </div>
              </div>
            )}

            <div className="admin-form-group">
              <label>Warden's Message to Students</label>
              <textarea
                className="admin-textarea"
                rows={5}
                value={formData.wardenMessage || ''}
                onChange={(e) => handleFieldChange('wardenMessage', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── Tab 3: Mess Details ── */}
        {activeTab === 'mess' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🍽️ Mess Details</h3>
                <p>Configure mess seating capacity, menu details, and dining photo.</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Mess Description & Details</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={formData.mess || ''}
                onChange={(e) => handleFieldChange('mess', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Mess Image</label>
              <ImageUploadField
                value={formData.messImage}
                onChange={(url) => handleFieldChange('messImage', url)}
              />
            </div>
          </div>
        )}

        {/* ── Tab 4: Facilities ── */}
        {activeTab === 'facilities' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🏢 Hostel Facilities ({formData.facilities?.length || 0})</h3>
                <p>Manage hostel facilities like Wi-Fi, Library, Common Room, Laundry, etc.</p>
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() =>
                  setEditingFacility({
                    index: -1,
                    type: '',
                    title: '',
                    description: '',
                    quote: '',
                    image: '',
                  })
                }
              >
                + Add Facility
              </button>
            </div>

            <div className="admin-cards-grid">
              {formData.facilities?.map((fac, idx) => (
                <div key={idx} className="admin-item-card">
                  {fac.image && <img src={fac.image} alt={fac.title} className="admin-item-card-img" />}
                  <div className="admin-item-card-body">
                    <h4 className="admin-item-card-title">{fac.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', fontWeight: 600, marginBottom: '4px' }}>
                      Type: {fac.type}
                    </span>
                    <p className="admin-item-card-desc">{fac.description}</p>
                    {fac.quote && <p style={{ fontStyle: 'italic', fontSize: '0.78rem', color: '#64748b' }}>"{fac.quote}"</p>}
                    <div className="admin-item-card-actions">
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setEditingFacility({ ...fac, index: idx })}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => {
                          if (window.confirm(`Delete facility "${fac.title}"?`)) {
                            const updated = formData.facilities.filter((_, i) => i !== idx);
                            handleFieldChange('facilities', updated);
                          }
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Student Corner (Announcements) ── */}
        {activeTab === 'student-corner' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>📢 Student Corner & Announcements ({formData.announcements?.length || 0})</h3>
                <p>Post announcements, event circulars, mess notices, and updates specifically for this hostel.</p>
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={handleOpenAddAnnouncement}
              >
                + Post New Announcement
              </button>
            </div>

            {(!formData.announcements || formData.announcements.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  No announcements posted yet
                </h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Keep your hostel residents updated with notices, events, and important circulars.
                </p>
                <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleOpenAddAnnouncement}
                >
                  + Post First Announcement
                </button>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th style={{ width: '130px' }}>Category</th>
                      <th>Title & Description</th>
                      <th style={{ width: '130px' }}>Date</th>
                      <th style={{ width: '110px' }}>Document</th>
                      <th style={{ textAlign: 'right', width: '140px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.announcements.map((item, idx) => {
                      const tagColors = {
                        Important: { bg: '#fee2e2', text: '#b91c1c' },
                        Notice: { bg: '#e0f2fe', text: '#0369a1' },
                        Event: { bg: '#fef3c7', text: '#b45309' },
                        General: { bg: '#ede9fe', text: '#6d28d9' },
                      };
                      const colorStyle = tagColors[item.tag] || { bg: '#f1f5f9', text: '#475569' };

                      return (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                              <span
                                className="admin-hostel-tag"
                                style={{
                                  background: colorStyle.bg,
                                  color: colorStyle.text,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  fontSize: '0.72rem',
                                  padding: '0.2rem 0.55rem',
                                }}
                              >
                                {item.tag || 'Notice'}
                              </span>
                              {item.isNew && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    color: '#ea580c',
                                    background: '#ffedd5',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '4px',
                                  }}
                                >
                                  ✨ NEW
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                              {item.title}
                            </strong>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.45, maxHeight: '2.9em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.description}
                            </p>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#475569' }}>
                            📅 {item.date}
                          </td>
                          <td>
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                title={item.link}
                              >
                                📎 View
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>None</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ marginRight: '0.4rem' }}
                              onClick={() => setEditingAnnouncement({ ...item, index: idx })}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              title="Delete announcement"
                              onClick={() => {
                                if (window.confirm(`Delete announcement "${item.title}"?`)) {
                                  const updated = formData.announcements.filter((_, i) => i !== idx);
                                  handleFieldChange('announcements', updated);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 5: Staff & Team ── */}
        {activeTab === 'staff' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>👥 Hostel Staff & Attendants ({formData.staff?.length || 0})</h3>
                <p>Update hostel clerk, attendant contacts, phone numbers, and emails.</p>
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() =>
                  setEditingStaff({
                    index: -1,
                    id: (formData.staff?.length || 0) + 1,
                    name: '',
                    position: 'Attendant',
                    contact: '',
                    email: '-',
                  })
                }
              >
                + Add Staff Member
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.staff?.map((st, idx) => (
                    <tr key={idx}>
                      <td>{st.id || idx + 1}</td>
                      <td><strong>{st.name}</strong></td>
                      <td>{st.position}</td>
                      <td><code>{st.contact}</code></td>
                      <td>{st.email}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          style={{ marginRight: '0.4rem' }}
                          onClick={() => setEditingStaff({ ...st, index: idx })}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => {
                            if (window.confirm(`Remove staff member "${st.name}"?`)) {
                              const updated = formData.staff.filter((_, i) => i !== idx);
                              handleFieldChange('staff', updated);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 6: Committee ── */}
        {activeTab === 'committee' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🏛️ Hostel Committee ({formData.committee?.length || 0})</h3>
                <p>Manage student committee representatives (President, Secretaries, Members).</p>
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() =>
                  setEditingCommittee({
                    index: -1,
                    name: '',
                    rollNo: '',
                    designation: 'Member',
                    email: '',
                  })
                }
              >
                + Add Member
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Designation</th>
                    <th>Email</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.committee?.map((mem, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{mem.name}</strong></td>
                      <td><code>{mem.rollNo}</code></td>
                      <td>
                        <span className="admin-hostel-tag" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                          {mem.designation}
                        </span>
                      </td>
                      <td><a href={`mailto:${mem.email}`}>{mem.email}</a></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          style={{ marginRight: '0.4rem' }}
                          onClick={() => setEditingCommittee({ ...mem, index: idx })}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => {
                            if (window.confirm(`Remove committee member "${mem.name}"?`)) {
                              const updated = formData.committee.filter((_, i) => i !== idx);
                              handleFieldChange('committee', updated);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 7: Gallery & Carousel ── */}
        {activeTab === 'gallery' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <div>
                <h3>🖼️ Gallery & Hero Carousel Images</h3>
                <p>Manage photos showcased on the hostel carousel and events gallery.</p>
              </div>
            </div>

            {/* Carousel Images Section */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Hero Header Carousel Images ({formData.carouselImages?.length || 0})
            </h4>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <ImageUploadField
                  value={newCarouselImg}
                  onChange={setNewCarouselImg}
                  placeholder="Upload or enter image URL (e.g. /images/BH1/bh1_1.jpg)"
                  showPreview={false}
                />
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  if (newCarouselImg.trim()) {
                    const updated = [...(formData.carouselImages || []), newCarouselImg.trim()];
                    handleFieldChange('carouselImages', updated);
                    setNewCarouselImg('');
                  }
                }}
              >
                + Add Image
              </button>
            </div>

            <div className="admin-cards-grid" style={{ marginBottom: '2rem' }}>
              {formData.carouselImages?.map((url, idx) => (
                <div key={idx} className="admin-item-card">
                  <img src={url} alt={`Carousel ${idx + 1}`} className="admin-item-card-img" />
                  <div className="admin-item-card-body">
                    <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{url}</code>
                    <div className="admin-item-card-actions">
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => {
                          const updated = formData.carouselImages.filter((_, i) => i !== idx);
                          handleFieldChange('carouselImages', updated);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gallery Cards Section */}
            <div className="admin-card-header" style={{ marginTop: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                  Hostel Life Gallery ({formData.gallery?.length || 0})
                </h4>
              </div>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() =>
                  setEditingGallery({
                    index: -1,
                    imgSrc: '',
                    alt: 'Hostel Event',
                  })
                }
              >
                + Add Gallery Photo
              </button>
            </div>

            <div className="admin-cards-grid">
              {formData.gallery?.map((item, idx) => (
                <div key={idx} className="admin-item-card">
                  <img src={item.imgSrc} alt={item.alt} className="admin-item-card-img" />
                  <div className="admin-item-card-body">
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.alt}</span>
                    <code style={{ fontSize: '0.75rem', wordBreak: 'break-all', marginTop: '0.25rem' }}>{item.imgSrc}</code>
                    <div className="admin-item-card-actions">
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setEditingGallery({ ...item, index: idx })}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => {
                          const updated = formData.gallery.filter((_, i) => i !== idx);
                          handleFieldChange('gallery', updated);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 8: Security & Password ── */}
        {activeTab === 'security' && (
          <div className="admin-content-card" style={{ maxWidth: '600px' }}>
            <div className="admin-card-header">
              <div>
                <h3>🔒 Change Hostel Admin Password</h3>
                <p>Update password for {formData.name} ({config?.loginId}).</p>
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
                Update Password
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
            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={loadData}
            >
              Discard
            </button>
          )}
          <button
            className="admin-btn admin-btn-success admin-btn-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Facility Edit Modal ── */}
      {editingFacility && (
        <div className="admin-modal-backdrop" onClick={() => setEditingFacility(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>{editingFacility.index >= 0 ? 'Edit Facility' : 'Add New Facility'}</h4>
              <button className="admin-modal-close" onClick={() => setEditingFacility(null)}>×</button>
            </div>
            <div className="admin-form-group">
              <label>Facility Title</label>
              <input
                type="text"
                className="admin-input"
                value={editingFacility.title}
                onChange={(e) => setEditingFacility({ ...editingFacility, title: e.target.value })}
                placeholder="e.g. Modern Gym & Fitness"
              />
            </div>
            <div className="admin-form-group">
              <label>Facility Type</label>
              <input
                type="text"
                className="admin-input"
                value={editingFacility.type}
                onChange={(e) => setEditingFacility({ ...editingFacility, type: e.target.value })}
                placeholder="e.g. Gym, Library, Wi-Fi"
              />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={editingFacility.description}
                onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Quote / Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={editingFacility.quote}
                onChange={(e) => setEditingFacility({ ...editingFacility, quote: e.target.value })}
                placeholder="e.g. Stay fit, stay healthy."
              />
            </div>
            <div className="admin-form-group">
              <label>Image</label>
              <ImageUploadField
                value={editingFacility.image}
                onChange={(url) => setEditingFacility({ ...editingFacility, image: url })}
                placeholder="/images/library.jpg"
              />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingFacility(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  let updated = [...(formData.facilities || [])];
                  if (editingFacility.index >= 0) {
                    updated[editingFacility.index] = { ...editingFacility };
                    delete updated[editingFacility.index].index;
                  } else {
                    const newEntry = { ...editingFacility };
                    delete newEntry.index;
                    updated.push(newEntry);
                  }
                  handleFieldChange('facilities', updated);
                  setEditingFacility(null);
                }}
              >
                Save Facility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Staff Edit Modal ── */}
      {editingStaff && (
        <div className="admin-modal-backdrop" onClick={() => setEditingStaff(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>{editingStaff.index >= 0 ? 'Edit Staff Member' : 'Add Staff Member'}</h4>
              <button className="admin-modal-close" onClick={() => setEditingStaff(null)}>×</button>
            </div>
            <div className="admin-form-group">
              <label>Staff Name</label>
              <input
                type="text"
                className="admin-input"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Position / Role</label>
              <input
                type="text"
                className="admin-input"
                value={editingStaff.position}
                onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                placeholder="Clerk / Attendant"
              />
            </div>
            <div className="admin-form-group">
              <label>Contact Phone Number</label>
              <input
                type="text"
                className="admin-input"
                value={editingStaff.contact}
                onChange={(e) => setEditingStaff({ ...editingStaff, contact: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Email Address</label>
              <input
                type="text"
                className="admin-input"
                value={editingStaff.email}
                onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                placeholder="hwb1@nitj.ac.in or -"
              />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingStaff(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  let updated = [...(formData.staff || [])];
                  if (editingStaff.index >= 0) {
                    updated[editingStaff.index] = { ...editingStaff };
                    delete updated[editingStaff.index].index;
                  } else {
                    const newEntry = { ...editingStaff, id: updated.length + 1 };
                    delete newEntry.index;
                    updated.push(newEntry);
                  }
                  handleFieldChange('staff', updated);
                  setEditingStaff(null);
                }}
              >
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Committee Edit Modal ── */}
      {editingCommittee && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCommittee(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>{editingCommittee.index >= 0 ? 'Edit Committee Member' : 'Add Committee Member'}</h4>
              <button className="admin-modal-close" onClick={() => setEditingCommittee(null)}>×</button>
            </div>
            <div className="admin-form-group">
              <label>Student Name</label>
              <input
                type="text"
                className="admin-input"
                value={editingCommittee.name}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, name: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Roll Number</label>
              <input
                type="text"
                className="admin-input"
                value={editingCommittee.rollNo}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, rollNo: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Designation</label>
              <select
                className="admin-select"
                value={editingCommittee.designation}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, designation: e.target.value })}
              >
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Cultural Secretary">Cultural Secretary</option>
                <option value="Sports Secretary">Sports Secretary</option>
                <option value="Technical Secretary">Technical Secretary</option>
                <option value="Member">Member</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Student Email</label>
              <input
                type="email"
                className="admin-input"
                value={editingCommittee.email}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, email: e.target.value })}
              />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingCommittee(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  let updated = [...(formData.committee || [])];
                  if (editingCommittee.index >= 0) {
                    updated[editingCommittee.index] = { ...editingCommittee };
                    delete updated[editingCommittee.index].index;
                  } else {
                    const newEntry = { ...editingCommittee };
                    delete newEntry.index;
                    updated.push(newEntry);
                  }
                  handleFieldChange('committee', updated);
                  setEditingCommittee(null);
                }}
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Gallery Edit Modal ── */}
      {editingGallery && (
        <div className="admin-modal-backdrop" onClick={() => setEditingGallery(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>{editingGallery.index >= 0 ? 'Edit Gallery Photo' : 'Add Gallery Photo'}</h4>
              <button className="admin-modal-close" onClick={() => setEditingGallery(null)}>×</button>
            </div>
            <div className="admin-form-group">
              <label>Image</label>
              <ImageUploadField
                value={editingGallery.imgSrc}
                onChange={(url) => setEditingGallery({ ...editingGallery, imgSrc: url })}
                placeholder="/images/BH1/bh1_1.jpg"
              />
            </div>
            <div className="admin-form-group">
              <label>Caption / Alt Text</label>
              <input
                type="text"
                className="admin-input"
                value={editingGallery.alt}
                onChange={(e) => setEditingGallery({ ...editingGallery, alt: e.target.value })}
                placeholder="Hostel Event / Life"
              />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingGallery(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  let updated = [...(formData.gallery || [])];
                  if (editingGallery.index >= 0) {
                    updated[editingGallery.index] = { ...editingGallery };
                    delete updated[editingGallery.index].index;
                  } else {
                    const newEntry = { ...editingGallery };
                    delete newEntry.index;
                    updated.push(newEntry);
                  }
                  handleFieldChange('gallery', updated);
                  setEditingGallery(null);
                }}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Announcement Edit / Create Modal ── */}
      {editingAnnouncement && (
        <div className="admin-modal-backdrop" onClick={() => setEditingAnnouncement(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h4>{editingAnnouncement.index >= 0 ? '✏️ Edit Announcement' : '📢 Post New Announcement'}</h4>
              <button className="admin-modal-close" onClick={() => setEditingAnnouncement(null)}>×</button>
            </div>

            <div className="admin-form-group">
              <label>Announcement Title *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Room Allotment for 2026-27 or Water Supply Interruption"
                value={editingAnnouncement.title || ''}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Category / Tag</label>
                <select
                  className="admin-select"
                  value={editingAnnouncement.tag || 'Notice'}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, tag: e.target.value })}
                >
                  <option value="Notice">Notice</option>
                  <option value="Important">Important</option>
                  <option value="Event">Event</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Date (e.g. 22 Oct 2026)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingAnnouncement.date || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                  placeholder="DD Mon YYYY"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={Boolean(editingAnnouncement.isNew)}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isNew: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#1a56db' }}
                />
                <span>Highlight with "NEW" Badge on Student Corner</span>
              </label>
              <small style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginTop: '0.2rem' }}>
                Displays an attention-grabbing "NEW" indicator on the public hostel portal.
              </small>
            </div>

            <div className="admin-form-group">
              <label>Announcement Details / Description *</label>
              <textarea
                className="admin-textarea"
                rows={4}
                placeholder="Provide detailed information, timings, guidelines, or venue for students..."
                value={editingAnnouncement.description || ''}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Attachment / Circular Document or Link (Optional)</label>
              <ImageUploadField
                value={editingAnnouncement.link || ''}
                onChange={(url) => setEditingAnnouncement({ ...editingAnnouncement, link: url })}
                placeholder="Upload PDF / Notice Image or paste web link"
                accept="image/*,application/pdf"
              />
              <small style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginTop: '0.3rem' }}>
                Students will be able to click "View Details →" to view this uploaded circular, flyer, or URL.
              </small>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setEditingAnnouncement(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  if (!editingAnnouncement.title?.trim()) {
                    alert('Please enter an announcement title.');
                    return;
                  }
                  if (!editingAnnouncement.description?.trim()) {
                    alert('Please enter announcement details.');
                    return;
                  }

                  let updated = [...(formData.announcements || [])];
                  if (editingAnnouncement.index >= 0) {
                    const itemToSave = { ...editingAnnouncement };
                    delete itemToSave.index;
                    updated[editingAnnouncement.index] = itemToSave;
                  } else {
                    const newEntry = {
                      ...editingAnnouncement,
                      id: Date.now(),
                      date: editingAnnouncement.date || getTodayFormatted(),
                    };
                    delete newEntry.index;
                    updated.unshift(newEntry);
                  }

                  handleFieldChange('announcements', updated);
                  setEditingAnnouncement(null);
                }}
              >
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
};

export default AdminDashboard;
