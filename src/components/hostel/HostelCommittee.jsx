import './HostelCommittee.css';

/* Leadership roles get the accent chip; everyone else gets the neutral one */
const LEAD_ROLES = ['President', 'Vice President'];

const desigClass = (designation) =>
  `hc-desig ${LEAD_ROLES.includes(designation) ? 'hc-desig--lead' : ''}`;

/* ── Initials Avatar ─────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return <div className="hc-avatar">{initials}</div>;
};

/* ── Main Component ──────────────────────────────────────── */
const HostelCommittee = ({ committee }) => {
  if (!committee || committee.length === 0) {
    return (
      <div className="hc-empty">
        <p>Committee details will be updated soon.</p>
      </div>
    );
  }

  return (
    <div className="hc-root">
      {/* Summary row */}
      <div className="hc-summary">
        <span><strong>{committee.length}</strong> members</span>
        <span className="hc-summary-sep">·</span>
        <span>Session 2025–26</span>
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
              return (
                <tr key={i} className="hc-tr">
                  {/* Serial */}
                  <td className="hc-td hc-td--no">{i + 1}</td>

                  {/* Name + avatar */}
                  <td className="hc-td">
                    <div className="hc-name-cell">
                      <Avatar name={member.name} />
                      <span className="hc-name">{member.name}</span>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="hc-td">
                    <span className="hc-roll">{member.rollNo}</span>
                  </td>

                  {/* Designation badge */}
                  <td className="hc-td">
                    <span className={desigClass(member.designation)}>
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
          return (
            <div key={i} className="hc-member-card">
              <div className="hc-mc-top">
                <Avatar name={member.name} />
                <div className="hc-mc-info">
                  <span className="hc-mc-name">{member.name}</span>
                  <span className={`${desigClass(member.designation)} hc-mc-desig`}>
                    {member.designation}
                  </span>
                </div>
                <span className="hc-mc-no">#{i + 1}</span>
              </div>
              <div className="hc-mc-details">
                <div className="hc-mc-row">
                  <span className="hc-mc-label">Roll No.</span>
                  <span className="hc-roll">{member.rollNo}</span>
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

    </div>
  );
};

export default HostelCommittee;
