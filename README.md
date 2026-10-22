# 🏛️ NIT Jalandhar Hostel Portal & Content Management System

A comprehensive web portal for **Dr. B.R. Ambedkar National Institute of Technology, Jalandhar (NITJ)** hostels. The application features rich public pages for the institute and all 15 hostel blocks, paired with a multi-tenant **Admin Panel** that allows administrators to edit and update content in real-time.

---

## 📑 Table of Contents
1. [Quick Start & Setup](#-quick-start--setup)
2. [Site Navigation Guide](#-site-navigation-guide)
   - [Public Homepage](#1-public-homepage-)
   - [Individual Hostel Pages](#2-individual-hostel-pages-hostelkey)
3. [Admin Credentials Master Table](#-admin-credentials-master-table)
4. [Admin Portal Guide](#-admin-portal-guide)
   - [Logging In](#how-to-log-in)
   - [Main Website Admin Features](#main-website-homepage-admin-features)
   - [Hostel Admin Features](#hostel-admin-features)
   - [Data Persistence & Reset](#data-persistence-backup--reset)
5. [Project Architecture & File Structure](#-project-architecture--file-structure)

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation & Execution

The project has two parts that run side by side: the **website** (React + Vite) and the **API server** (`server/`).

```bash
# 1. Install dependencies for both parts
npm install
cd server && npm install && cd ..

# 2. Configure the server (MongoDB, JWT secret, Cloudinary keys)
cp server/.env.example server/.env   # then fill in the values

# 3. First time only: create the admin accounts (prints initial passwords)
cd server && npm run seed && cd ..

# 4. Start the API server (terminal 1)
cd server && npm run dev

# 5. Start the website (terminal 2)
npm run dev
```

The portal will be live at:
- **Public Website:** `http://localhost:5173/`
- **Admin Portal:** `http://localhost:5173/admin`
- **API:** `http://localhost:5050/api` (Vite forwards `/api` here during development)

### Production Build
```bash
# Build optimized production bundle (point it at your deployed API)
VITE_API_URL=https://your-api-domain/api npm run build
```

---

## 🗺️ Site Navigation Guide

### 1. Public Homepage (`/`)
The homepage serves as the central hub for the institute's residential campus:

- **Top Sticky Navbar**:
  - **Home**: Jumps back to the top of the homepage.
  - **Life at NITJ**: Smooth-scrolls to the hostel life highlights section.
  - **Dignitaries**: Quick access to messages from leadership.
  - **Boys Hostels Dropdown**: Direct links to all 10 boys' hostel blocks.
  - **Girls Hostels Dropdown**: Direct links to all 4 girls' hostel blocks.
  - **⚙️ Admin Link**: Takes you straight to the Admin Login page.
- **Hero Section**:
  - Welcomes visitors with campus imagery, taglines, and an "Explore Hostels" shortcut button.
- **Why Choose NITJ Hostels?**:
  - 4 core feature cards highlighting Community, Study Environment, Sports, and Dining.
- **Milestone Statistics**:
  - Dynamic counters (5000+ Students, 14 Hostel Blocks, 24/7 Security, 100% WiFi).
- **Life at Hostels**:
  - Curated photo reels and lifestyle overview of students on campus.
- **Dignitaries' Messages**:
  - **Director's Message**: Welcome address from the Director.
  - **Dean Student Welfare (DSW) Message**: Address on student community, welfare, and activities.
  - **Associate Dean Hostel's Message**: Guidelines and message on safety, hygiene, and residential life.
- **Hostels Directory**:
  - Interactive grid categorizing all Boys' and Girls' hostels with direct clickable links.
- **Site Footer**:
  - Credits and institutional copyright.

---

### 2. Individual Hostel Pages (`/:hostelKey`)
*Example URLs: `/BH-1`, `/BH-7`, `/MBH-A-Block`, `/MBH-E-Block`, `/girls-hostel-1`*

Each of the 15 hostels features a customized, fully animated page with a dedicated sticky navbar:

- **Hostel Navbar (Scroll-Spy Navigation)**:
  - **Home (←)**: Returns to the institute homepage.
  - **About**: Background, history, room count, and floor plans.
  - **Warden's Message**: Warden photograph, contact email, and personal message.
  - **Mess**: Mess facilities, seating capacity, and hygienic meal details.
  - **Facilities**: Library, High-speed Wi-Fi, Parks, Laundry, Common Rooms, and Security.
  - **Gallery**: Event photos and hostel memories.
  - **Contact**: Administrative staff contacts (Clerks, Attendants) with phone numbers.
  - **Committee**: Student committee table with names, designations, roll numbers, and emails.
  - **Student Corner**: Announcements, notices, guidelines, and downloadable resources.
  - **⚙️ Admin Shortcut Button**: Located at the top right of the navbar; takes the hostel administrator straight to their pre-selected login page.

---

## 🔑 Admin Accounts

There are **16 admin accounts**: 1 Main Website admin (who can edit everything) and 15 hostel admins (who can each edit only their own hostel).

| Login ID | Portal (New River Name) | Previous Designation |
| :--- | :--- | :--- |
| `admin_main` | Main Website (Homepage) | Global |
| `admin_bh1` | Krishna Boys Hostel | Hostel No. 1 (Boys) |
| `admin_bh2` | Sutlej Boys Hostel | Hostel No. 2 (Boys) |
| `admin_bh3` | Beas Boys Hostel | Hostel No. 3 (Boys) |
| `admin_bh4` | Ravi Boys Hostel | Hostel No. 4 (Boys) |
| `admin_bh5` | Chenab Boys Hostel | Hostel No. 5 (Boys) |
| `admin_bh6` | Jhelum Boys Hostel | Hostel No. 6 (Boys) |
| `admin_bh7` | Brahmaputra Boys Hostel | Hostel No. 7 (Boys) |
| `admin_mbha` | Narmada Boys Hostel | Mega Boys Hostel Block-A |
| `admin_mbhb` | Godavari Boys Hostel | Mega Boys Hostel Block-B |
| `admin_mbhe` | Bhagirathi Boys Hostel | Mega Boys Hostel Block-E |
| `admin_mbhf` | Sabarmati Boys Hostel | Mega Boys Hostel Block-F |
| `admin_gh1` | Sarsawati Girls Hostel | Girls Hostel 1 (GH-1) |
| `admin_gh2` | Ganga Girls Hostel | Girls Hostel 2 (GH-2) |
| `admin_mgh1` | Alaknanda Girls Hostel | Mega Girls Hostel 1 |
| `admin_mgh2` | Yamuna Girls Hostel | Mega Girls Hostel Phase-II |

Passwords are **not** stored in the code. `npm run seed` (in `server/`) generates them and prints them once; they are saved hashed in MongoDB. Share them privately and have each admin change theirs from the **Security & Password** tab.

---

## 🛠️ Admin Portal Guide

### How to Log In
1. Visit `http://localhost:5173/admin` (or click **⚙️ Admin** anywhere on the website).
2. Choose your portal or hostel using **either method**:
   - **Method A:** Select your hostel from the **"Select Website or Hostel"** dropdown list.
   - **Method B:** Enter your **Login ID** (e.g. `admin_main`, `admin_bh1`, etc.).
3. Enter your password (use the toggle icon `👁️` to view or hide the password).
4. Click **Sign In to Dashboard**.

> **Forgot Password?**: Clicking the **"Forgot password?"** link displays an institutional notice advising the administrator to contact the Webmaster (`webmaster@nitj.ac.in`) or the Hostel Administration Office (DSW) for password reset. Self-service password reset is disabled for institutional security.

---

### Main Website (Homepage) Admin Features
*Logged in as: `admin_main`*

The Main Website Admin oversees global institute information displayed on the homepage:

- **🏠 Hero Banner**: Edit welcome text, main title, subtitle tagline, explore button text, and custom background image.
- **🌟 Why Choose NITJ**: Edit card titles, descriptions, and FontAwesome icon classes for the 4 highlight cards.
- **📊 Key Statistics**: Change the counter numbers and labels (e.g., student counts, WiFi percentage).
- **🎓 Director's Message**: Update Director name, designation, custom photo URL, and speech paragraphs.
- **🤝 DSW Message**: Update Dean Student Welfare name, designation, custom photo URL, and speech paragraphs.
- **👨‍🏫 Associate Dean Hostel Message**: Update Associate Dean Hostel name, designation, custom photo URL, and speech paragraphs.
- **🏢 All Hostels Control Hub**: View all 15 hostels with quick links to inspect public pages or switch to manage any individual hostel as a Super Admin.
- **🔒 Security & Password**: Change the `admin_main` password.

---

### Hostel Admin Features
*Logged in as any hostel admin (e.g. `admin_bh1`, `admin_gh1`, etc.)*

Hostel admins have complete control over their specific hostel page:

- **🏠 Overview**: Update hostel display name, description, cover photo URL, and contact note.
- **👨‍💼 Warden**: Update warden details (name, designation, email, phone, photo, and student welcome message). Supports hostels with 1 warden or 2 wardens via dynamic **"➕ Add Additional Warden"** and **"🗑️ Remove Additional Warden"** options.
- **🍽️ Mess**: Configure dining descriptions, seating capacity details, and mess photo URL.
- **🏢 Facilities**: Interactive management of amenities (Library, Wi-Fi, Gym, Laundry, etc.):
  - Add new facilities with title, type, description, tagline quote, and image URL.
  - Edit or delete existing facilities.
- **📢 Student Corner**: Post announcements, circulars, and updates specifically for this hostel:
  - Add new announcements with title, category tag (*Notice, Important, Event, General*), date, and details.
  - Upload circular PDFs, notices, or flyers directly, or link external documents.
  - Toggle the ✨ **"NEW"** badge to spotlight timely notices.
  - Edit or delete existing notices.
- **👥 Staff & Attendants**: Manage administrative and caretaking staff:
  - Add, edit, or delete staff members with name, position (Clerk, Attendant), contact phone, and email.
- **🏛️ Hostel Committee**: Manage elected student representatives:
  - Add, edit, or delete committee members (President, Vice President, Secretaries, Members) with roll number and email.
- **🖼️ Gallery & Carousel**:
  - Add or remove URLs for the top hero carousel slider.
  - Add, edit, or delete event and campus life gallery photos.
- **🔒 Security & Password**: Update the admin password for that hostel.

---

### Data Persistence, Backup & Reset

- **Saved on the server**: edits are stored in MongoDB, so every visitor sees them as soon as they are saved. Uploaded images are stored on Cloudinary.
- **Defaults as fallback**: until a page is customised (or if the API is unreachable) the site shows the defaults from `src/data/hostelContent.js` / `src/utils/homeDataManager.js`.
- **💾 Save Changes**: Sticky action bar at the bottom confirms when unsaved changes exist and allows saving.
- **👁️ View Live Page**: Opens the live page in a new browser tab to instantly review edits.
- **📥 Export JSON**: Downloads a complete `.json` backup file of the customized content.
- **🔄 Reset Defaults**: Deletes the saved customisations for that page so it shows the defaults again.

---

## 🏗️ Project Architecture & File Structure

```
NITJ-HOSTEL-main/
├── index.html                   # HTML entry point
├── package.json                 # Website dependencies & scripts
├── vite.config.js               # Vite config (+ /api proxy to the server)
│
├── public/images/               # Static images served at /images/... (one folder per hostel)
│
├── server/                      # 🖥️ Backend API (Express + MongoDB + Cloudinary)
│   ├── .env.example             # Copy to .env and fill in secrets
│   └── src/
│       ├── index.js             # Server entry: middleware, routes, DB connection
│       ├── portals.js           # List of the 15 admin portals
│       ├── seed.js              # Creates admin accounts
│       ├── middleware/auth.js   # JWT verification & edit permissions
│       ├── models/              # Admin.js, Content.js (Mongoose schemas)
│       └── routes/              # auth.js, content.js, upload.js
│
└── src/                         # 🌐 Frontend (React)
    ├── main.jsx                 # App entry: routes
    ├── styles/index.css         # Global styles
    │
    ├── pages/                   # One folder per route
    │   ├── HomePage/            # "/"           HomePage.jsx + HomePage.css
    │   └── HostelPage/          # "/:hostel"    HostelPage.jsx + HostelPage.css
    │
    ├── components/
    │   ├── layout/              # Navbar, Footer
    │   ├── home/                # Homepage sections: DirectorMessage, DswMessage,
    │   │                        #   AssociateDeanMessage, HostelList, LifeAtHostels
    │   │                        #   (LeaderMessage.css is shared by the DSW & Associate Dean cards)
    │   └── hostel/              # Hostel page sections: Carousel, MBHAbout, WardenMessage,
    │                            #   MBHMess, Facilities, Gallery, Contact, HostelCommittee, StudentCorner
    │
    ├── admin/                   # ⚙️ Admin panel (/admin)
    │   ├── AdminPortal.jsx      # Shows login or the right dashboard
    │   ├── AdminLogin.jsx
    │   ├── MainAdminDashboard.jsx # Homepage editor
    │   ├── AdminDashboard.jsx   # Single-hostel editor
    │   ├── ImageUploadField.jsx # Image URL input + Cloudinary upload button
    │   └── Admin.css
    │
    ├── data/                    # 📄 Default content
    │   ├── hostelContent.js     # Default data for all 14 hostels
    │   └── announcements.js     # Student Corner announcements
    │
    ├── utils/                   # 🧠 Talking to the API
    │   ├── api.js               # fetch wrapper, auth token, image upload
    │   ├── hostelDataManager.js # Hostel content, admin login/logout/password
    │   └── homeDataManager.js   # Homepage content (+ homepage defaults)
    │
    └── assets/images/           # Images bundled into the build (director, DSW, etc.)
```

---

## 💡 Tips for Admins

1. **Changing Your Password**: Always remember to change your default password on your first login via the **Security & Password** tab.
2. **Adding Images**: Click **⬆️ Upload** next to any image field to upload a photo, or use existing local paths (e.g. `/images/BH1/bh1_1.jpg`) or direct web URLs (e.g. `https://...`) for photos, wardens, facilities, and gallery images.
3. **Restoring Defaults**: If you ever want to revert your experimental edits back to the initial setup, click the **🔄 Reset Defaults** button in the header.
4. **Exporting Backups**: Use the **📥 Export JSON** button before making major changes to keep a saved copy of your content.

---

Developed for **NIT Jalandhar Hostels** • © 2026 NITJ Hostel Portal

## Backend (Express + MongoDB + Cloudinary)

All site content and admin accounts live in the backend in [`server/`](server/). The frontend shows bundled defaults until the API responds, then switches to the saved content. Anything an admin saves is stored in MongoDB and every visitor sees it.

### Setup
1. `cd server && npm install`
2. `cp .env.example .env` and fill in `MONGODB_URI` (MongoDB Atlas free tier works), `JWT_SECRET`, and the three `CLOUDINARY_*` keys (from cloudinary.com → Dashboard).
3. `npm run seed` creates the 15 admin accounts (homepage + 14 hostels) and prints their initial passwords. Share each one privately, then have the admin change it under *Security & Password*.
4. `npm run dev` starts the API on http://localhost:5050.
5. In the project root, run `npm run dev`. Vite forwards `/api` to the server.

### Production
- Host `server/` on Render, Railway or a college server, and set the same env vars there plus `CLIENT_ORIGIN=https://your-frontend-domain`.
- Build the frontend with `VITE_API_URL=https://your-api-domain/api npm run build`.

### API
| Method | Path | Auth |
|---|---|---|
| GET | `/api/content/:key` (`home` or a hostel key) | public |
| PUT / DELETE | `/api/content/:key` | main admin: any page; hostel admin: only their own hostel |
| POST | `/api/upload` (multipart `image`) → `{ url }` | any admin |
| POST | `/api/auth/login`, `/api/auth/change-password` | — / admin |
