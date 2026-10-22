/**
 * ============================================================
 *  STUDENT CORNER — ANNOUNCEMENTS DATA
 * ============================================================
 *  HOW TO ADD A NEW ANNOUNCEMENT (Admin Guide):
 *
 *  1. Find the hostel key below (e.g. 'BH-1', 'girls-hostel-1').
 *  2. Add a new object to its array:
 *
 *     {
 *       id: <unique number>,
 *       title: 'Your Announcement Title',
 *       date: 'DD Mon YYYY',           // e.g. '17 Mar 2026'
 *       description: 'Full details…',
 *       tag: 'Notice',                 // Notice | Event | Important | General
 *       link: 'https://…',             // optional — shows a "Read More" button
 *       isNew: true,                   // optional — shows a 🆕 badge
 *     },
 *
 *  3. Save the file. The change appears instantly on the hostel page.
 *
 *  To add a global notice visible on ALL hostels, add to the
 *  `global` array at the bottom of this file.
 * ============================================================
 */

const announcements = {

  'BH-1': [
    {
      id: 1,
      title: 'Room Allotment for 2025–26',
      date: '15 Mar 2026',
      description: 'Room allotment for the new academic session has been uploaded on the DSW portal. Students are requested to report to the hostel office with required documents.',
      tag: 'Notice',
      isNew: true,
    },
    {
      id: 2,
      title: 'Hostel Day Celebration',
      date: '10 Mar 2026',
      description: 'Annual Hostel Day celebration will be held on 25 March 2026. All residents are invited. Cultural performances, food stalls, and prizes await!',
      tag: 'Event',
      isNew: true,
    },
    {
      id: 3,
      title: 'Mess Fee Payment Deadline',
      date: '01 Mar 2026',
      description: 'The last date to pay mess fee for March 2026 is 5th March. Late payments will attract a penalty as per hostel rules.',
      tag: 'Important',
    },
  ],

  'BH-2': [
    {
      id: 1,
      title: 'Maintenance Work — Water Supply Interruption',
      date: '16 Mar 2026',
      description: 'Water supply will be interrupted from 9 AM to 1 PM on 18 March 2026 due to scheduled pipeline maintenance. Students are advised to store water accordingly.',
      tag: 'Notice',
      isNew: true,
    },
    {
      id: 2,
      title: 'Sports Week 2026',
      date: '05 Mar 2026',
      description: 'Inter-hostel Sports Week begins on 20 March. Register with your hostel sports rep by 18 March to participate in cricket, volleyball, and badminton.',
      tag: 'Event',
    },
  ],

  'BH-3': [
    {
      id: 1,
      title: 'Anti-Ragging Pledge',
      date: '12 Mar 2026',
      description: 'All residents are required to sign the anti-ragging pledge form available at the hostel office before 20 March 2026.',
      tag: 'Important',
      isNew: true,
    },
  ],

  'BH-5': [
    {
      id: 1,
      title: 'Welcome to Boys Hostel 5',
      date: '19 Mar 2026',
      description: 'Boys Hostel 5 is now live on the portal. Announcements for BH-5 will appear here. Residents are requested to check this section regularly for updates.',
      tag: 'General',
      isNew: true,
    },
  ],

  'BH-6': [
    {
      id: 1,
      title: 'New Common Room Facilities',
      date: '08 Mar 2026',
      description: 'A new TV, carom board, and table tennis table have been installed in the common room. Timings: 6 PM – 10 PM on weekdays, 10 AM – 10 PM on weekends.',
      tag: 'General',
      isNew: true,
    },
  ],

  'BH-7': [
    {
      id: 1,
      title: 'Electricity Meter Reading',
      date: '14 Mar 2026',
      description: 'Electricity meter reading will be conducted on 20 March 2026. Students are requested to be present in their rooms between 9 AM – 12 PM.',
      tag: 'Notice',
      isNew: true,
    },
  ],

  'girls-hostel-1': [
    {
      id: 1,
      title: 'Self-Defence Workshop',
      date: '13 Mar 2026',
      description: 'A self-defence workshop is scheduled for 22 March 2026 at 10 AM in the hostel gymnasium. All female residents are encouraged to attend.',
      tag: 'Event',
      isNew: true,
    },
    {
      id: 2,
      title: 'Gate Timing Reminder',
      date: '02 Mar 2026',
      description: 'Residents are reminded that the hostel gate closes at 9:30 PM. Late entries require prior written permission from the warden.',
      tag: 'Notice',
    },
  ],

  'girls-hostel-2': [
    {
      id: 1,
      title: 'Yoga & Wellness Session',
      date: '10 Mar 2026',
      description: 'Weekly yoga sessions start from 24 March 2026, every Sunday at 7 AM on the hostel lawn. Participation is free and open to all residents.',
      tag: 'Event',
      isNew: true,
    },
  ],

  'mega-girls-hostel-1': [
    {
      id: 1,
      title: 'Laundry Service Update',
      date: '11 Mar 2026',
      description: 'The in-house laundry service is now available 7 days a week from 8 AM to 8 PM. Contact the ground floor office to book a slot.',
      tag: 'General',
      isNew: true,
    },
  ],

  'MGH-Phase-II': [
    {
      id: 1,
      title: 'Hostel Committee Elections 2026',
      date: '09 Mar 2026',
      description: 'Nominations are open for Hostel Committee 2026–27. Submit your nomination form at the hostel office by 25 March. Elections will be held on 30 March.',
      tag: 'Notice',
      isNew: true,
    },
  ],

  'MBH-A-Block': [
    {
      id: 1,
      title: 'Wi-Fi Upgrade Completed',
      date: '07 Mar 2026',
      description: 'High-speed Wi-Fi (1 Gbps) has been successfully upgraded across all floors of MBH A Block. New credentials will be shared via your institute email.',
      tag: 'General',
      isNew: true,
    },
    {
      id: 2,
      title: 'Fire Safety Drill',
      date: '03 Mar 2026',
      description: 'A mandatory fire safety drill is scheduled for 22 March at 8 AM. All residents must participate. Assembly point: main ground.',
      tag: 'Important',
    },
  ],

  'MBH-B-Block': [
    {
      id: 1,
      title: 'Mess Menu Revision',
      date: '15 Mar 2026',
      description: 'The mess menu for April 2026 has been revised based on student feedback. The updated menu is displayed on the mess notice board.',
      tag: 'Notice',
      isNew: true,
    },
  ],

  'MBH-E-Block': [
    {
      id: 1,
      title: 'Welcome to Bhagirathi Boys Hostel',
      date: '16 Mar 2026',
      description: 'Welcome to Bhagirathi Boys Hostel (Mega Boys Hostel Block-E). Residents are requested to check the notices here regularly for updates.',
      tag: 'General',
      isNew: true,
    },
  ],

  'MBH-F-Block': [
    {
      id: 1,
      title: 'Induction Programme for New Residents',
      date: '16 Mar 2026',
      description: 'An induction programme for newly allotted residents will be held on 21 March at 5 PM in the common hall. Attendance is mandatory.',
      tag: 'Important',
      isNew: true,
    },
  ],

  /**
   * Global announcements appear on EVERY hostel page.
   * Great for institute-wide notices.
   */
  global: [
    {
      id: 'g1',
      title: 'DSW Office Notice — Hostel Leave Application',
      date: '17 Mar 2026',
      description: 'All outstation leave applications must be submitted online via the DSW portal at least 24 hours in advance. Walk-in applications will no longer be accepted.',
      tag: 'Important',
      isNew: true,
      link: 'https://nitj.ac.in',
    },
  ],
};

export default announcements;
