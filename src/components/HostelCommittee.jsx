import './HostelCommittee.css';

/* ── Designation badge colours ──────────────────────────── */
const DESIG_META = {
  'President':           { color: '#7c3aed', bg: '#f5f3ff' },
  'Vice President':      { color: '#0d7d4a', bg: '#eafaf1' },
  'Secretary':           { color: '#1255b8', bg: '#eef4ff' },
  'Treasurer':           { color: '#b45309', bg: '#fffbeb' },
  'Cultural Secretary':  { color: '#be185d', bg: '#fdf2f8' },
  'Sports Secretary':    { color: '#0e7490', bg: '#ecfeff' },
  'Technical Secretary': { color: '#1d4ed8', bg: '#eff6ff' },
  'Member':              { color: '#475569', bg: '#f1f5f9' },
};

const getDesigStyle = (designation) =>
  DESIG_META[designation] || { color: '#475569', bg: '#f1f5f9' };

/* ── Initials Avatar ─────────────────────────────────────── */
const Avatar = ({ name, index }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const PALETTE = [
    ['#1255b8', '#dbeafe'],
    ['#7c3aed', '#ede9fe'],
    ['#0d7d4a', '#dcfce7'],
    ['#b45309', '#fef3c7'],
    ['#be185d', '#fce7f3'],
    ['#0e7490', '#cffafe'],
  ];
  const [fg, bg] = PALETTE[index % PALETTE.length];

  return (
    <div className="hc-avatar" style={{ background: bg, color: fg }}>
      {initials}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
const HostelCommittee = ({ committee }) => {
  if (!committee || committee.length === 0) {
    return (
      <div className="hc-empty">
        <span>🏛️</span>
        <p>Committee details will be updated soon.</p>
      </div>
    );
  }

  return (
    <div className="hc-root">
      {/* Summary row */}
      <div className="hc-summary">
        <span className="hc-summary-count">
          <strong>{committee.length}</strong> Members
        </span>
        <span className="hc-summary-note">Session 2025–26</span>
      </div>

      {/* Responsive table */}
      <div className="hc-table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th className="hc-th hc-th--no">#</th>
              <th className="hc-th">Student Name</th>
              <th className="hc-th">Roll No.</th>
              <th className="hc-th">Designation</th>
              <th className="hc-th">Email</th>
            </tr>
          </thead>
          <tbody>
            {committee.map((member, i) => {
              const ds = getDesigStyle(member.designation);
              return (
                <tr key={i} className="hc-tr">
                  {/* Serial */}
                  <td className="hc-td hc-td--no">{i + 1}</td>

                  {/* Name + avatar */}
                  <td className="hc-td">
                    <div className="hc-name-cell">
                      <Avatar name={member.name} index={i} />
                      <span className="hc-name">{member.name}</span>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="hc-td">
                    <code className="hc-roll">{member.rollNo}</code>
                  </td>

                  {/* Designation badge */}
                  <td className="hc-td">
                    <span
                      className="hc-desig"
                      style={{ color: ds.color, background: ds.bg }}
                    >
                      {member.designation}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="hc-td">
                    <a
                      href={`mailto:${member.email}`}
                      className="hc-email"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {member.email}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards (shown below 640 px) */}
      <div className="hc-cards">
        {committee.map((member, i) => {
          const ds = getDesigStyle(member.designation);
          return (
            <div key={i} className="hc-member-card">
              <div className="hc-mc-top">
                <Avatar name={member.name} index={i} />
                <div className="hc-mc-info">
                  <span className="hc-mc-name">{member.name}</span>
                  <span
                    className="hc-desig hc-mc-desig"
                    style={{ color: ds.color, background: ds.bg }}
                  >
                    {member.designation}
                  </span>
                </div>
                <span className="hc-mc-no">#{i + 1}</span>
              </div>
              <div className="hc-mc-details">
                <div className="hc-mc-row">
                  <span className="hc-mc-label">Roll No.</span>
                  <code className="hc-roll">{member.rollNo}</code>
                </div>
                <div className="hc-mc-row">
                  <span className="hc-mc-label">Email</span>
                  <a href={`mailto:${member.email}`} className="hc-email">
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="hc-admin-hint">
        ✏️ Admin: edit <code>src/components/HostelContent.jsx</code> to update committee members.
      </p>
    </div>
  );
};

export default HostelCommittee;
