import { useState } from 'react';
import './StudentCorner.css';

const ALL_TAGS = ['All', 'Notice', 'Event', 'Important', 'General'];

/* ── Single Announcement Card ───────────────────────────── */
const AnnouncementCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.description.length > 130;

  return (
    <div className="sc-card">
      <div className="sc-card-top">
        {/* Tag pill */}
        <span className={`sc-tag ${item.tag === 'Important' ? 'sc-tag--important' : ''}`}>
          {item.tag}
        </span>

        {/* NEW badge */}
        {item.isNew && (
          <span className="sc-new-badge">NEW</span>
        )}

        {/* Date */}
        <span className="sc-date">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {item.date}
        </span>
      </div>

      <h3 className="sc-card-title">{item.title}</h3>

      <p className={`sc-card-desc ${expanded ? 'sc-card-desc--full' : ''}`}>
        {item.description}
      </p>

      <div className="sc-card-footer">
        {isLong && (
          <button
            className="sc-read-toggle"
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-link-btn"
          >
            View Details →
          </a>
        )}
      </div>
    </div>
  );
};

/* ── Main StudentCorner Component ───────────────────────── */
const StudentCorner = ({ hostelKey, announcements, customAnnouncements }) => {
  const [activeTag, setActiveTag] = useState('All');

  /* Merge hostel-specific + global announcements */
  const hostelAnnouncements = customAnnouncements !== undefined
    ? customAnnouncements
    : (announcements?.[hostelKey] || []);
  const globalAnnouncements = (announcements?.global || []).map(a => ({
    ...a,
    _isGlobal: true,
  }));

  const allItems = [...hostelAnnouncements, ...globalAnnouncements];

  const filtered =
    activeTag === 'All'
      ? allItems
      : allItems.filter(a => a.tag === activeTag);

  const newCount = allItems.filter(a => a.isNew).length;

  return (
    <div className="sc-root">
      {/* Toolbar: filters + new count */}
      <div className="sc-toolbar">
        <div className="sc-filters">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              className={`sc-filter-btn ${activeTag === tag ? 'sc-filter-btn--active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {newCount > 0 && <span className="sc-new-count">{newCount} new</span>}
      </div>

      {/* Announcements grid / list */}
      {filtered.length === 0 ? (
        <div className="sc-empty">
          <p>No {activeTag !== 'All' ? activeTag.toLowerCase() : ''} announcements at this time.</p>
        </div>
      ) : (
        <div className="sc-grid">
          {filtered.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="sc-card-wrapper"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <AnnouncementCard item={item} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default StudentCorner;
