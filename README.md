# 🏨 V-RESOLVE: Autonomous Residential Life & SLA Platform

**Degree:** B.Tech CSE AI & ML Engineering (2nd Year - 3rd Semester)  
**Institute:** VIT Bhopal University  

---

## 📌 About the Project

Hostel-related maintenance and safety issues—such as electrical faults, water leaks, hygiene concerns, and security matters—are common challenges in residential campus life. Traditional paper-based registers at hostel receptions make it difficult for students to track resolution progress, hold staff accountable, or escalate critical emergencies.

Starting as a Core Java console prototype, **V-RESOLVE (Hostel Grievance Redressal & SLA Management System)** has been upgraded into a full-stack **Web Application and RESTful API Platform**. It provides a unified digital interface for students to lodge and track complaints, wardens to manage block-level operations, and administrators to monitor real-time SLA compliance, workload analytics, and automated SMS notifications.

---

## ✨ Key Features

### 1. 🎓 Student Portal
* **Lodge Complaints:** Submit detailed grievances using name, roll number, hostel block/room number, and contact details.
* **7 Supported Categories:** `ELECTRICAL`, `WATER`, `FIRE_SAFETY`, `SECURITY`, `HYGIENE`, `DEPOSIT_DISPUTE`, and `MAINTENANCE`.
* **Live Ticket Tracking:** Search and track real-time complaint status via the `/api/student/track.php` endpoint using Roll Number, Room Number, or Complaint ID.
* **Verification & Rating Loop:** A complaint is only finalized after the student confirms the fix (`confirm.php`) and submits a **1 to 5-star rating** with feedback.
* **Reopen Tickets:** Students can immediately reopen unresolved or recurring issues (`reopen.php`).

### 2. 👨‍💼 Warden Portal
* **Automated Block Assignment:** Incoming complaints are automatically routed to the warden assigned to that specific hostel block.
* **Workflow Management:** Wardens can transition tickets to `IN_PROGRESS` (`progress.php`) with work notes and mark them `RESOLVED` (`resolve.php`) once completed.
* **Profile & Block Management:** Manage warden assignments and records via dedicated warden endpoints (`api/wardens/`).

### 3. 🏛️ Admin & Chief Warden Portal
* **Role-Based Authentication:** Secure session/token authentication (`login.php`, `logout.php`, `verify.php`) protecting administrative and warden routes.
* **Real-Time Analytics Dashboard:** Powered by `api/stats/index.php`, displaying total tickets, active vs. resolved ratios, category breakdowns, and average student satisfaction ratings.
* **24-Hour Emergency SLA Monitoring:** Critical complaints under `FIRE_SAFETY` and `SECURITY` trigger a strict 24-hour SLA countdown, highlighting breaches for immediate administrative intervention.
* **Data Maintenance:** Administrative ability to purge obsolete or test records (`purge.php`) and monitor system health (`health.php`).

### 4. 📱 Automated SMS Notification Service
* **Integrated SMS Gateway:** Built-in `sms_service.php` and configuration module (`api/sms/config.php`, `api/sms/test.php`) to dispatch real-time SMS alerts for critical SLA escalations, ticket creation, and resolution updates.

### 5. 🌐 Modern Web & PWA-Ready Frontend
* **Responsive SPA Interface:** Built with semantic HTML5 (`index.html`), custom CSS3 (`style.css`), and asynchronous Vanilla JavaScript (`app.js`).
* **Installable Web App:** Configured with `site.webmanifest`, `browserconfig.xml`, OpenGraph metadata (`og-image.png`), and multi-platform icons for mobile and desktop installation.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (`app.js`) | Responsive UI, asynchronous `fetch()` API calls, dynamic DOM rendering |
| **Backend API** | PHP 8.x (RESTful Architecture) | Modular API endpoints for auth, complaints, stats, tracking, and wardens |
| **Database** | MySQL / MariaDB (`api/db.php`) | Relational data persistence using PDO/MySQLi and environment variables (`.env`) |
| **Notifications** | PHP SMS Service (`sms_service.php`) | Automated SMS alerts and gateway testing |
| **Server / Routing** | Apache (`.htaccess`) | URL rewriting, CORS handling, and directory security |

---

## 📁 Project Structure

```text
htdocs/
├── .env                                # Environment variables (DB & SMS credentials)
├── .htaccess                           # Apache server configuration & routing rules
├── index.html                          # Main Single-Page Application (SPA) entry point
├── style.css                           # Custom stylesheet and responsive layout
├── app.js                              # Frontend application logic & API integration
├── site.webmanifest                    # PWA manifest configuration
├── browserconfig.xml                   # Windows tile configuration
├── robots.txt & sitemap.xml            # SEO and crawler configurations
│
├── [Assets & Icons]
│   ├── favicon.ico / favicon.svg
│   ├── favicon-16x16.png / 32x32 / 48x48
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png / 512x512.png
│   ├── mstile-150x150.png
│   └── og-image.png
│
└── api/                                # Backend REST API
    ├── .htaccess                       # API security and routing rules
    ├── index.php                       # API root handler
    ├── config.php                      # Core application configuration
    ├── db.php                          # Database connection & schema initialization
    ├── health.php                      # System & database health check endpoint
    ├── sms_service.php                 # Core SMS dispatch engine
    │
    ├── auth/                           # Authentication Module
    │   ├── login.php                   # Warden/Admin login
    │   ├── logout.php                  # Session termination
    │   └── verify.php                  # Session/Token verification
    │
    ├── complaints/                     # Grievance Lifecycle Module
    │   ├── index.php                   # Create & list/filter complaints
    │   ├── progress.php                # Mark complaint as IN_PROGRESS
    │   ├── resolve.php                 # Mark complaint as RESOLVED
    │   ├── confirm.php                 # Student confirmation & 1-5 star rating
    │   ├── reopen.php                  # Reopen unsatisfactory resolutions
    │   └── purge.php                   # Admin bulk/record deletion
    │
    ├── student/                        # Student Operations
    │   └── track.php                   # Track tickets by Roll No, Room, or ID
    │
    ├── wardens/                        # Warden Management
    │   ├── index.php                   # List and add wardens
    │   └── update.php                  # Update warden details & block assignments
    │
    ├── stats/                          # Analytics & SLA Module
    │   └── index.php                   # Dashboard metrics, SLA breaches & ratings
    │
    └── sms/                            # SMS Gateway Configuration
        ├── config.php                  # SMS API keys and sender settings
        └── test.php                    # Diagnostic endpoint for SMS testing
```

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health.php` | Verify API and database connectivity |
| `POST` | `/api/auth/login.php` | Authenticate Warden or Administrator |
| `POST` | `/api/auth/logout.php` | Log out current user session |
| `GET` | `/api/auth/verify.php` | Validate active authentication session |
| `GET / POST` | `/api/complaints/index.php` | Fetch filtered complaints or lodge a new complaint |
| `POST` | `/api/complaints/progress.php` | Update ticket status to `IN_PROGRESS` |
| `POST` | `/api/complaints/resolve.php` | Mark ticket as `RESOLVED` with resolution notes |
| `POST` | `/api/complaints/confirm.php` | Student confirms resolution and submits star rating |
| `POST` | `/api/complaints/reopen.php` | Student reopens an unresolved complaint |
| `POST / DELETE` | `/api/complaints/purge.php` | Admin endpoint to purge complaint records |
| `GET` | `/api/student/track.php` | Search complaints by Student ID, Room, or Ticket ID |
| `GET / POST` | `/api/wardens/index.php` | View all wardens and workload or register a new warden |
| `POST / PUT` | `/api/wardens/update.php` | Update warden block assignment or contact info |
| `GET` | `/api/stats/index.php` | Retrieve overall analytics, SLA breaches, and ratings |
| `POST` | `/api/sms/test.php` | Trigger a test SMS to verify gateway configuration |

---

## 🚀 How to Run the Project

### Prerequisites
* **XAMPP / WAMP / Laragon / LAMP** (Apache + PHP 8.0+ + MySQL)
* Any modern web browser

### Installation Steps

1. **Clone or Extract the Project:**
   Copy the project files into your web server's root directory (e.g., `C:/xampp/htdocs/v-resolve/`).

2. **Configure Environment Variables:**
   Open the `.env` file (or `api/config.php`) and update your MySQL database credentials and SMS API keys:
   ```env
   DB_HOST=localhost
   DB_NAME=v_resolve_db
   DB_USER=root
   DB_PASS=
   SMS_API_KEY=your_sms_api_key
   ```

3. **Start Apache & MySQL:**
   Open the XAMPP Control Panel and start both the **Apache** and **MySQL** modules. (The database tables and initial seed data are automatically handled via `api/db.php`).

4. **Launch the Application:**
   Open your browser and navigate to:
   ```text
   http://localhost/v-resolve/
   ```
   To check API health directly, visit:
   ```text
   http://localhost/v-resolve/api/health.php
   ```

---

## 🔑 Demo Data & Pre-Configured Roles

### Pre-Registered Wardens
* `W1` — **Mr. Verma** (Block 1) | Phone: `+91-98765-00001`
* `W2` — **Mrs. Rao** (Block 5) | Phone: `+91-98765-00002`
* `W3` — **Mr. Khan** (Block 3) | Phone: `+91-98765-00003`

### Sample Students
* `S101` — **Aarav Patel** (Room C-204, Block C)
* `S102` — **Priya Nair** (Room A-108, Block A)
* `S103` — **Karan Singh** (Room B-312, Block B)

### Chief Administrator
* `A1` — **Dr. AnantKant Shukla** (Dean of Student Welfare)

---

## 👥 Contributor

**UJJAVAL GUPTA**  
2nd Year B.Tech CSE (AI & ML), VIT Bhopal University  
**Reg No:** `25BAI11102`

### Acknowledgment
Special thanks to **Dr. Sanat Jain Sir** for his guidance on software architecture, object-oriented design principles, and system development throughout the semester.
