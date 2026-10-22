// Single source of truth for admin portals (homepage + each hostel).
export const PORTALS = [
  { key: 'main', name: 'Main Website (Homepage)', loginId: 'admin_main' },
  { key: 'BH-1', name: 'Krishna Boys Hostel', loginId: 'admin_bh1' },
  { key: 'BH-2', name: 'Sutlej Boys Hostel', loginId: 'admin_bh2' },
  { key: 'BH-3', name: 'Beas Boys Hostel', loginId: 'admin_bh3' },
  { key: 'BH-4', name: 'Ravi Boys Hostel', loginId: 'admin_bh4' },
  { key: 'BH-5', name: 'Chenab Boys Hostel', loginId: 'admin_bh5' },
  { key: 'BH-6', name: 'Jhelum Boys Hostel', loginId: 'admin_bh6' },
  { key: 'BH-7', name: 'Brahmaputra Boys Hostel', loginId: 'admin_bh7' },
  { key: 'MBH-A-Block', name: 'Narmada Boys Hostel', loginId: 'admin_mbha' },
  { key: 'MBH-B-Block', name: 'Godavari Boys Hostel', loginId: 'admin_mbhb' },
  { key: 'MBH-E-Block', name: 'Bhagirathi Boys Hostel', loginId: 'admin_mbhe' },
  { key: 'MBH-F-Block', name: 'Sabarmati Boys Hostel', loginId: 'admin_mbhf' },
  { key: 'girls-hostel-1', name: 'Sarsawati Girls Hostel', loginId: 'admin_gh1' },
  { key: 'girls-hostel-2', name: 'Ganga Girls Hostel', loginId: 'admin_gh2' },
  { key: 'mega-girls-hostel-1', name: 'Alaknanda Girls Hostel', loginId: 'admin_mgh1' },
  { key: 'MGH-Phase-II', name: 'Yamuna Girls Hostel', loginId: 'admin_mgh2' },
];

export const HOSTEL_KEYS = PORTALS.filter((p) => p.key !== 'main').map((p) => p.key);
