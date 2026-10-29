/**
 * V-RESOLVE - SMART HOSTEL GRIEVANCE REDRESSAL & SLA MANAGEMENT ECOSYSTEM
 * Client-Side Application Engine (Vanilla ES6+)
 * 
 * Features:
 * - Bespoke Original University Branding (Not a plain VTOP copy)
 * - 4-Card Architecture: Student, Employee (Warden), Parent (Dean Administration), Alumni (Developer: Ujjaval Gupta)
 * - Protected Deanery Administration for Dean Ujjaval Gupta (ujjaval@vit)
 * - Protected Warden Supervisor Desk (Block A, B, C Wardens)
 * - Lead Software Architect & Developer Portfolio Modal (Ujjaval Gupta, Reg No: 25BAI11102)
 * - Printable Official Grievance Docket (PDF) with simulated Barcode & QR Code
 * - Master Audit Register Export to CSV
 * - Real-Time Telco SMS Simulation with Web Audio Chime
 * - 24-Hour Multi-Threaded SLA Monitoring Daemon
 */

// ============================================================================
// INSTANT GLOBAL MODAL CONTROLLERS (Zero UI Lag / Always Available)
// ============================================================================
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    el.style.display = 'flex';
  }
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    el.style.display = 'none';
  }
};

// ============================================================================
// PRE-CONFIGURED ENCRYPTED STAFF CREDENTIALS
// ============================================================================
// SHA-256 for universal password 'vitbhopal': 624f7275f7b6c227b94e2632b0be1d880cd4cbe1e483203d655d351f89b83422
const UNIVERSAL_SHA256 = '624f7275f7b6c227b94e2632b0be1d880cd4cbe1e483203d655d351f89b83422';

const STAFF_ACCOUNTS = {
  // Dean & Chief Administrator: Dean Ujjaval Gupta (Password: vitbhopal)
  'ujjaval': {
    username: 'ujjaval',
    name: 'Dean Ujjaval Gupta',
    role: 'ADMIN',
    assignedBlock: 'All Blocks',
    id: 'A1',
    passwordHash: UNIVERSAL_SHA256
  },
  'ujjaval.gupta': {
    username: 'ujjaval.gupta',
    name: 'Dean Ujjaval Gupta',
    role: 'ADMIN',
    assignedBlock: 'All Blocks',
    id: 'A1',
    passwordHash: UNIVERSAL_SHA256
  },
  'admin': {
    username: 'admin',
    name: 'Dean Ujjaval Gupta',
    role: 'ADMIN',
    assignedBlock: 'All Blocks',
    id: 'A1',
    passwordHash: UNIVERSAL_SHA256
  },
  'dean': {
    username: 'dean',
    name: 'Dean Ujjaval Gupta',
    role: 'ADMIN',
    assignedBlock: 'All Blocks',
    id: 'A1',
    passwordHash: UNIVERSAL_SHA256
  },

  // Block C Warden: Mr. Verma (Password: vitbhopal)
  'warden.c': {
    username: 'warden.c',
    name: 'Mr. Verma',
    role: 'WARDEN',
    assignedBlock: 'Block C',
    id: 'W1',
    passwordHash: UNIVERSAL_SHA256
  },
  'verma': {
    username: 'verma',
    name: 'Mr. Verma',
    role: 'WARDEN',
    assignedBlock: 'Block C',
    id: 'W1',
    passwordHash: UNIVERSAL_SHA256
  },
  'w1': {
    username: 'w1',
    name: 'Mr. Verma',
    role: 'WARDEN',
    assignedBlock: 'Block C',
    id: 'W1',
    passwordHash: UNIVERSAL_SHA256
  },

  // Block A Warden: Mrs. Rao (Password: vitbhopal)
  'warden.a': {
    username: 'warden.a',
    name: 'Mrs. Rao',
    role: 'WARDEN',
    assignedBlock: 'Block A',
    id: 'W2',
    passwordHash: UNIVERSAL_SHA256
  },
  'rao': {
    username: 'rao',
    name: 'Mrs. Rao',
    role: 'WARDEN',
    assignedBlock: 'Block A',
    id: 'W2',
    passwordHash: UNIVERSAL_SHA256
  },
  'w2': {
    username: 'w2',
    name: 'Mrs. Rao',
    role: 'WARDEN',
    assignedBlock: 'Block A',
    id: 'W2',
    passwordHash: UNIVERSAL_SHA256
  },

  // Block B Warden: Mr. Khan (Password: vitbhopal)
  'warden.b': {
    username: 'warden.b',
    name: 'Mr. Khan',
    role: 'WARDEN',
    assignedBlock: 'Block B',
    id: 'W3',
    passwordHash: UNIVERSAL_SHA256
  },
  'khan': {
    username: 'khan',
    name: 'Mr. Khan',
    role: 'WARDEN',
    assignedBlock: 'Block B',
    id: 'W3',
    passwordHash: UNIVERSAL_SHA256
  },
  'w3': {
    username: 'w3',
    name: 'Mr. Khan',
    role: 'WARDEN',
    assignedBlock: 'Block B',
    id: 'W3',
    passwordHash: UNIVERSAL_SHA256
  },

  // Block D Warden: Dr. Suresh Patel (Password: vitbhopal)
  'warden.d': {
    username: 'warden.d',
    name: 'Dr. Suresh Patel',
    role: 'WARDEN',
    assignedBlock: 'Block D',
    id: 'W4',
    passwordHash: UNIVERSAL_SHA256
  },
  'w4': {
    username: 'w4',
    name: 'Dr. Suresh Patel',
    role: 'WARDEN',
    assignedBlock: 'Block D',
    id: 'W4',
    passwordHash: UNIVERSAL_SHA256
  }
};

const DEFAULT_WARDENS = [
  { id: "W1", name: "Mr. Verma", assignedBlock: "Block C", contactNumber: "+91-98765-00001" },
  { id: "W2", name: "Mrs. Rao", assignedBlock: "Block A", contactNumber: "+91-98765-00002" },
  { id: "W3", name: "Mr. Khan", assignedBlock: "Block B", contactNumber: "+91-98765-00003" },
  { id: "W4", name: "Dr. Suresh Patel", assignedBlock: "Block D", contactNumber: "+91 98765 43219" }
];

function getDeletedWardenIds() {
  try {
    return JSON.parse(localStorage.getItem('vresolve_deleted_wardens') || '[]');
  } catch (e) {
    return [];
  }
}

function mergeWardens(serverWardens = [], localWardens = []) {
  const deleted = getDeletedWardenIds().map(id => String(id).trim().toLowerCase());
  const map = new Map();

  // 1. Default baseline wardens (skip if de-allotted)
  DEFAULT_WARDENS.forEach(w => {
    if (!deleted.includes(String(w.id).toLowerCase())) {
      map.set(String(w.id).toLowerCase(), { ...w });
    }
  });

  // 2. Previously cached / manual wardens
  (localWardens || []).forEach(w => {
    if (w && w.id && !deleted.includes(String(w.id).toLowerCase())) {
      map.set(String(w.id).toLowerCase(), { ...w });
    }
  });

  // 3. Authoritative server wardens from MySQL take precedence
  (serverWardens || []).forEach(w => {
    if (w && w.id && !deleted.includes(String(w.id).toLowerCase())) {
      map.set(String(w.id).toLowerCase(), { ...w });
    }
  });

  return Array.from(map.values());
}

// Production Clean Slate: No mock complaints. All complaints originate from live student submissions.
const DEFAULT_COMPLAINTS = [];

// ============================================================================
// APPLICATION STATE
// ============================================================================
const state = {
  isServerConnected: false,
  currentUser: null, // { username, name, role: 'ADMIN' | 'WARDEN', assignedBlock, id }
  sessionToken: null,
  loginTargetRole: 'ADMIN', // 'ADMIN' | 'WARDEN'
  currentView: 'home', // 'home' | 'studentSection' | 'wardenSection' | 'adminSection'
  studentTab: 'lodge', // 'lodge' | 'track'
  mainWardenFilter: 'ALL',
  complaints: [],
  wardens: [],
  selectedComplaintIdForModal: null,
  smsTimeoutId: null,
  slaIntervalId: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initClock();
  restoreSession();
  setupModals();

  await checkServerConnection();
  await loadInitialData();

  updateAuthUI();
  handleUrlRouting(); // Opens target portal if #warden, #dean, #student is in URL
  startSlaMonitor();
});

window.addEventListener('hashchange', () => {
  handleUrlRouting();
});

function initClock() {
  const clockEl = document.getElementById('systemClock');
  const update = () => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
      ' | ' + now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };
  update();
  setInterval(update, 1000);
}

function restoreSession() {
  const savedUser = sessionStorage.getItem('vresolve_session_user') || localStorage.getItem('vresolve_session_user');
  const savedToken = sessionStorage.getItem('vresolve_session_token') || localStorage.getItem('vresolve_session_token');
  if (savedUser && savedToken) {
    try {
      state.currentUser = JSON.parse(savedUser);
      state.sessionToken = savedToken;
    } catch (e) {
      state.currentUser = null;
      state.sessionToken = null;
    }
  }
}

function persistSession(user, token) {
  state.currentUser = user;
  state.sessionToken = token;
  if (user && token) {
    sessionStorage.setItem('vresolve_session_user', JSON.stringify(user));
    sessionStorage.setItem('vresolve_session_token', token);
    localStorage.setItem('vresolve_session_user', JSON.stringify(user));
    localStorage.setItem('vresolve_session_token', token);
  } else {
    sessionStorage.removeItem('vresolve_session_user');
    sessionStorage.removeItem('vresolve_session_token');
    localStorage.removeItem('vresolve_session_user');
    localStorage.removeItem('vresolve_session_token');
  }
  updateAuthUI();
}

// Map clean API endpoints directly to concrete PHP scripts for 100% InfinityFree / Apache reliability
const API_ENDPOINTS = {
  'api/health': 'api/health.php',
  'api/auth/login': 'api/auth/login.php',
  'api/auth/logout': 'api/auth/logout.php',
  'api/auth/verify': 'api/auth/verify.php',
  'api/complaints': 'api/complaints/index.php',
  'api/complaints/progress': 'api/complaints/progress.php',
  'api/complaints/resolve': 'api/complaints/resolve.php',
  'api/complaints/confirm': 'api/complaints/confirm.php',
  'api/complaints/reopen': 'api/complaints/reopen.php',
  'api/complaints/purge': 'api/complaints/purge.php',
  'api/student/track': 'api/student/track.php',
  'api/wardens': 'api/wardens/index.php',
  'api/wardens/update': 'api/wardens/index.php',
  'api/sms/config': 'api/sms/config.php',
  'api/sms/test': 'api/sms/test.php',
  'api/stats': 'api/stats/index.php'
};

function apiUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  let clean = path.startsWith('/') ? path.substring(1) : path;

  const qIdx = clean.indexOf('?');
  const route = qIdx >= 0 ? clean.substring(0, qIdx) : clean;
  const query = qIdx >= 0 ? clean.substring(qIdx) : '';

  if (API_ENDPOINTS[route]) {
    clean = API_ENDPOINTS[route] + query;
  }

  const p = window.location.pathname || '/';
  let base = '/';
  if (p.includes('/')) {
    base = p.substring(0, p.lastIndexOf('/') + 1);
  }
  return base + clean;
}

function authHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (state.sessionToken) {
    headers['Authorization'] = 'Bearer ' + state.sessionToken;
    headers['X-Auth-Token'] = state.sessionToken;
    if (state.currentUser && state.currentUser.role) {
      headers['X-User-Role'] = state.currentUser.role;
    }
  }
  return headers;
}

async function checkServerConnection() {
  try {
    const res = await fetch(apiUrl('api/health'), { method: 'GET' });
    if (res.ok) {
      state.isServerConnected = true;
      return;
    }
  } catch (err) {}
  state.isServerConnected = false;
}

async function loadInitialData() {
  // 1. Purge any stale mock complaints from localStorage
  try {
    const stale = localStorage.getItem('grievance_complaints');
    if (stale && (stale.includes('CMP1001') || stale.includes('CMP1002') || stale.includes('CMP1008') || stale.includes('Aarav Patel'))) {
      localStorage.removeItem('grievance_complaints');
    }
  } catch (e) {}

  // 2. Load custom wardens appointed by Dean into STAFF_ACCOUNTS
  try {
    const customStaff = localStorage.getItem('vresolve_custom_staff_accounts');
    if (customStaff) {
      const parsed = JSON.parse(customStaff);
      Object.assign(STAFF_ACCOUNTS, parsed);
    }
  } catch (e) {}

  // 3. Load wardens from localStorage first
  const storedWardens = localStorage.getItem('grievance_wardens');
  if (storedWardens) {
    try { state.wardens = mergeWardens([], JSON.parse(storedWardens)); }
    catch (e) { state.wardens = mergeWardens([], DEFAULT_WARDENS); }
  } else {
    state.wardens = mergeWardens([], DEFAULT_WARDENS);
  }

  // 4. Load complaints from localStorage first
  const storedComplaints = localStorage.getItem('grievance_complaints');
  if (storedComplaints) {
    try {
      const parsed = JSON.parse(storedComplaints);
      state.complaints = Array.isArray(parsed) ? parsed.filter(c => !['CMP1001', 'CMP1002', 'CMP1003', 'CMP1004', 'CMP1007', 'CMP1008', 'CMP1011'].includes(c.id)) : [];
    } catch (e) {
      state.complaints = [];
    }
  } else {
    state.complaints = [];
  }

  // 5. LIVE SERVER SYNC: Always fetch appointed wardens from MySQL without requiring login!
  if (state.isServerConnected) {
    try {
      const wardRes = await fetch(apiUrl('api/wardens'));
      if (wardRes.ok) {
        const liveWardens = await wardRes.json();
        if (Array.isArray(liveWardens) && liveWardens.length > 0) {
          state.wardens = mergeWardens(liveWardens, state.wardens);
          localStorage.setItem('grievance_wardens', JSON.stringify(state.wardens));
        }
      }
    } catch (e) {}
  }

  // 6. LIVE SERVER SYNC: Fetch complaints if authorized staff session exists
  if (state.isServerConnected && state.currentUser) {
    try {
      const compUrl = apiUrl('api/complaints') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
      const compRes = await fetch(compUrl, {
        headers: authHeaders()
      });
      if (compRes.ok) {
        state.complaints = await compRes.json();
        localStorage.setItem('grievance_complaints', JSON.stringify(state.complaints));
      }
    } catch (e) {}
  }
}

function saveLocalData() {
  localStorage.setItem('grievance_complaints', JSON.stringify(state.complaints));
  localStorage.setItem('grievance_wardens', JSON.stringify(state.wardens));
}

// Master complaints reloader
window.loadComplaints = async function() {
  if (state.isServerConnected && state.currentUser) {
    try {
      const compUrl = apiUrl('api/complaints') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
      const compRes = await fetch(compUrl, {
        headers: authHeaders()
      });
      if (compRes.ok) {
        state.complaints = await compRes.json();
        localStorage.setItem('grievance_complaints', JSON.stringify(state.complaints));
        return state.complaints;
      }
    } catch (e) {}
  }
  const stored = localStorage.getItem('grievance_complaints');
  if (stored) {
    try { state.complaints = JSON.parse(stored); } catch (e) {}
  }
  return state.complaints;
};

window.refreshWardenQueue = async function() {
  const countEl = document.getElementById('mainWardenCountText');
  if (countEl) countEl.textContent = 'Updating work orders queue...';
  await window.loadComplaints();
  renderMainWardenDesk();
  showToast('Hostel Warden queue refreshed.', 'info');
};

// ============================================================================
// NAVIGATION & PORTAL ROUTING (DEDICATED SECTIONS & URL HASH ROUTING)
// ============================================================================

function handleUrlRouting() {
  const hash = (window.location.hash || '').toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const portal = (params.get('portal') || '').toLowerCase();

  if (hash === '#warden' || portal === 'warden') {
    openWardenPortalLogin();
  } else if (hash === '#dean' || portal === 'dean') {
    openAdminPortalLogin();
  } else if (hash === '#student' || portal === 'student') {
    openStudentPortal();
  } else if (hash === '#track' || portal === 'track') {
    openStudentPortal();
    switchStudentTab('track');
    const lastRoll = sessionStorage.getItem('vresolve_last_student_id') || localStorage.getItem('vresolve_last_student_id');
    if (lastRoll) {
      const searchInput = document.getElementById('studentSearchInput');
      if (searchInput) {
        searchInput.value = lastRoll;
        executeStudentTrackSearch();
      }
    }
  } else {
    navigateToHome();
  }
}

window.navigateToHome = function() {
  state.currentView = 'home';
  if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#') {
    history.pushState(null, '', window.location.pathname + window.location.search);
  }
  document.getElementById('portalSelectionHome').classList.remove('hidden');
  document.getElementById('studentSection').classList.add('hidden');
  document.getElementById('wardenSection').classList.add('hidden');
  document.getElementById('adminSection').classList.add('hidden');
};

window.openStudentPortal = function() {
  state.currentView = 'studentSection';
  window.location.hash = 'student';
  document.getElementById('portalSelectionHome').classList.add('hidden');
  document.getElementById('studentSection').classList.remove('hidden');
  document.getElementById('wardenSection').classList.add('hidden');
  document.getElementById('adminSection').classList.add('hidden');
  switchStudentTab('lodge');
};

window.openWardenPortalLogin = function() {
  if (state.currentUser && state.currentUser.role === 'WARDEN') {
    state.currentView = 'wardenSection';
    window.location.hash = 'warden';
    document.getElementById('portalSelectionHome').classList.add('hidden');
    document.getElementById('studentSection').classList.add('hidden');
    document.getElementById('wardenSection').classList.remove('hidden');
    document.getElementById('adminSection').classList.add('hidden');
    window.refreshWardenQueue();
  } else if (state.currentUser && state.currentUser.role === 'ADMIN') {
    showToast('You are currently signed in as Dean Ujjaval Gupta. To access the Warden Desk, please sign in with your Warden Staff Code.', 'info');
    openModal('wardenLoginModal');
  } else {
    openModal('wardenLoginModal');
  }
};

window.openAdminPortalLogin = function() {
  if (state.currentUser && state.currentUser.role === 'ADMIN') {
    state.currentView = 'adminSection';
    window.location.hash = 'dean';
    document.getElementById('portalSelectionHome').classList.add('hidden');
    document.getElementById('studentSection').classList.add('hidden');
    document.getElementById('wardenSection').classList.add('hidden');
    document.getElementById('adminSection').classList.remove('hidden');
    renderAdminDashboard();
  } else if (state.currentUser && state.currentUser.role === 'WARDEN') {
    showToast(`You are currently signed in as Warden ${state.currentUser.name}. Dean administrative clearance required.`, 'info');
    openModal('deanLoginModal');
  } else {
    openModal('deanLoginModal');
  }
};

window.openDeveloperModal = function() {
  openModal('developerModal');
};

window.switchStudentTab = function(tab) {
  state.studentTab = tab;
  const lodgeBtn = document.getElementById('sTabLodgeBtn');
  const trackBtn = document.getElementById('sTabTrackBtn');
  const lodgeTab = document.getElementById('studentLodgeTab');
  const trackTab = document.getElementById('studentTrackTab');

  if (tab === 'lodge') {
    lodgeBtn.style.background = '#1d4ed8';
    lodgeBtn.style.color = '#fff';
    trackBtn.style.background = '#f1f5f9';
    trackBtn.style.color = '#334155';
    lodgeTab.classList.remove('hidden');
    trackTab.classList.add('hidden');
  } else {
    trackBtn.style.background = '#1d4ed8';
    trackBtn.style.color = '#fff';
    lodgeBtn.style.background = '#f1f5f9';
    lodgeBtn.style.color = '#334155';
    trackTab.classList.remove('hidden');
    lodgeTab.classList.add('hidden');
  }
};

function updateAuthUI() {
  const chip = document.getElementById('authHeaderChip');
  const nameText = document.getElementById('authStatusText');
  const iconEl = document.getElementById('authRoleIcon');

  if (state.currentUser) {
    chip.classList.remove('hidden');
    nameText.textContent = `${state.currentUser.name} (${state.currentUser.role === 'ADMIN' ? 'Dean' : state.currentUser.assignedBlock})`;
    iconEl.textContent = state.currentUser.role === 'ADMIN' ? '🏛️' : '👨‍💼';
  } else {
    chip.classList.add('hidden');
  }
}

// ============================================================================
// INDEPENDENT AUTHENTICATION & LOGIN (DEAN & WARDEN SEPARATE)
// ============================================================================

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🔒';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
};

// DEDICATED DEAN LOGIN SUBMIT (ONLY DEAN / ADMIN PERMITTED)
window.handleDeanLoginSubmit = async function() {
  const username = (document.getElementById('deanLoginUsername').value || '').trim().toLowerCase();
  const rawPassword = document.getElementById('deanLoginPassword').value || '';
  const errorEl = document.getElementById('deanLoginErrorMessage');

  errorEl.classList.add('hidden');

  if (!username || !rawPassword) {
    errorEl.textContent = 'Please enter Dean username and password.';
    errorEl.classList.remove('hidden');
    return;
  }

  // Strict role enforcement: Warden credentials cannot access Dean desk!
  const knownAccount = STAFF_ACCOUNTS[username];
  if (knownAccount && knownAccount.role !== 'ADMIN') {
    errorEl.textContent = '❌ Access Denied: Warden account detected. Warden credentials cannot access Dean Executive Control Center. Please sign in via the Hostel Warden Portal.';
    errorEl.classList.remove('hidden');
    return;
  }

  const passwordHash = await sha256(rawPassword);

  // Live Server Check
  if (state.isServerConnected) {
    try {
      const res = await fetch(apiUrl('api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwordHash, expectedRole: 'ADMIN' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user.role !== 'ADMIN') {
          errorEl.textContent = '❌ Access Denied: Chief Administrator / Dean authorization required.';
          errorEl.classList.remove('hidden');
          return;
        }
        persistSession(data.user, data.token);
        closeModal('deanLoginModal');
        showToast(`Welcome Dean ${data.user.name}`, 'success');
        await loadInitialData();
        openAdminPortalLogin();
        return;
      } else {
        errorEl.textContent = data.error || 'Authentication failed. Please verify Dean credentials.';
        errorEl.classList.remove('hidden');
        return;
      }
    } catch (err) {}
  }

  // Offline Authenticator Check
  if (knownAccount && knownAccount.role === 'ADMIN' &&
      (knownAccount.passwordHash.toLowerCase() === passwordHash.toLowerCase() || rawPassword === 'vitbhopal')) {
    const offlineToken = 'offline_admin_' + Math.random().toString(36).substring(2);
    persistSession({
      id: knownAccount.id,
      username: knownAccount.username,
      name: knownAccount.name,
      role: 'ADMIN',
      assignedBlock: 'All Blocks'
    }, offlineToken);

    closeModal('deanLoginModal');
    showToast(`Welcome Dean ${knownAccount.name}`, 'success');
    openAdminPortalLogin();
  } else {
    errorEl.textContent = 'Invalid Dean credentials. Access denied.';
    errorEl.classList.remove('hidden');
  }
};

// DEDICATED WARDEN LOGIN SUBMIT (ONLY WARDEN PERMITTED)
window.handleWardenLoginSubmit = async function() {
  const username = (document.getElementById('wardenLoginUsername').value || '').trim().toLowerCase();
  const rawPassword = document.getElementById('wardenLoginPassword').value || '';
  const errorEl = document.getElementById('wardenLoginErrorMessage');

  errorEl.classList.add('hidden');

  if (!username || !rawPassword) {
    errorEl.textContent = 'Please enter Warden Staff ID and password.';
    errorEl.classList.remove('hidden');
    return;
  }

  // Strict role enforcement: Dean credentials cannot sign into Warden Desk!
  const knownAccount = STAFF_ACCOUNTS[username];
  if (knownAccount && knownAccount.role === 'ADMIN') {
    errorEl.textContent = '❌ Access Denied: Dean Administration account detected. Please sign in via the Hostel Administration Council portal.';
    errorEl.classList.remove('hidden');
    return;
  }

  const passwordHash = await sha256(rawPassword);

  // Live Server Check
  if (state.isServerConnected) {
    try {
      const res = await fetch(apiUrl('api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwordHash, expectedRole: 'WARDEN' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user.role !== 'WARDEN') {
          errorEl.textContent = '❌ Access Denied: Warden clearance required.';
          errorEl.classList.remove('hidden');
          return;
        }
        persistSession(data.user, data.token);
        closeModal('wardenLoginModal');
        showToast(`Authenticated as ${data.user.name} (${data.user.assignedBlock})`, 'success');
        await loadInitialData();
        openWardenPortalLogin();
        return;
      } else {
        errorEl.textContent = data.error || 'Authentication failed. Please verify Warden Staff ID.';
        errorEl.classList.remove('hidden');
        return;
      }
    } catch (err) {}
  }

  // Offline Authenticator Check
  if (knownAccount && knownAccount.role === 'WARDEN' &&
      (knownAccount.passwordHash.toLowerCase() === passwordHash.toLowerCase() || rawPassword === 'vitbhopal')) {
    const offlineToken = 'offline_warden_' + (knownAccount.id || 'W1') + '_' + Math.random().toString(36).substring(2);
    persistSession({
      id: knownAccount.id,
      username: knownAccount.username,
      name: knownAccount.name,
      role: 'WARDEN',
      assignedBlock: knownAccount.assignedBlock
    }, offlineToken);

    closeModal('wardenLoginModal');
    showToast(`Authenticated as ${knownAccount.name} (${knownAccount.assignedBlock})`, 'success');
    openWardenPortalLogin();
  } else {
    errorEl.textContent = 'Invalid Warden credentials. Please check your Staff ID.';
    errorEl.classList.remove('hidden');
  }
};

window.handleStaffLogout = function() {
  if (state.isServerConnected && state.sessionToken) {
    fetch(apiUrl('api/auth/logout'), {
      method: 'POST',
      headers: authHeaders()
    }).catch(() => {});
  }
  persistSession(null, null);
  showToast('Logged out successfully.', 'info');
  navigateToHome();
};

// ============================================================================
// REAL-TIME TELCO SMS SIMULATOR (WITH WEB AUDIO CHIME)
// ============================================================================

function playSmsNotificationChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

function triggerSmsPush(recipient, message) {
  const banner = document.getElementById('smsNotificationBanner');
  const recipientEl = document.getElementById('smsRecipientDisplay');
  const bodyEl = document.getElementById('smsBodyDisplay');
  const timeEl = document.getElementById('smsTimeDisplay');

  recipientEl.textContent = `To: ${recipient}`;
  bodyEl.textContent = message;
  timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  banner.classList.remove('hidden');
  playSmsNotificationChime();

  if (state.smsTimeoutId) clearTimeout(state.smsTimeoutId);
  state.smsTimeoutId = setTimeout(() => {
    closeSmsBanner();
  }, 10000);
}

window.closeSmsBanner = function() {
  const banner = document.getElementById('smsNotificationBanner');
  if (banner) banner.classList.add('hidden');
};

// ============================================================================
// STUDENT GRIEVANCE SUBMISSION
// ============================================================================

window.autoDetectBlock = function(roomVal) {
  const hintEl = document.getElementById('blockDetectHint');
  const clean = (roomVal || '').trim().toUpperCase();
  if (clean.startsWith('A') || clean.startsWith('BLOCK A')) {
    hintEl.textContent = '✓ Assigned Jurisdiction: Block A Warden (Mrs. Rao)';
  } else if (clean.startsWith('B') || clean.startsWith('BLOCK B')) {
    hintEl.textContent = '✓ Assigned Jurisdiction: Block B Warden (Mr. Khan)';
  } else if (clean.startsWith('C') || clean.startsWith('BLOCK C')) {
    hintEl.textContent = '✓ Assigned Jurisdiction: Block C Warden (Mr. Verma)';
  } else if (clean.length > 0) {
    hintEl.textContent = 'ℹ️ Block jurisdiction will be assigned automatically based on room prefix.';
  } else {
    hintEl.textContent = '';
  }
};

window.submitStudentComplaint = async function() {
  const name = document.getElementById('lodgeName').value.trim();
  const studentId = document.getElementById('lodgeStudentId').value.trim();
  const room = document.getElementById('lodgeRoom').value.trim();
  const contact = document.getElementById('lodgeContact').value.trim();
  const category = document.getElementById('lodgeCategory').value;
  const description = document.getElementById('lodgeDescription').value.trim();

  if (!name || !studentId || !room || !contact || !category || !description) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const payload = {
    studentName: name,
    studentId: studentId,
    studentRoom: room,
    studentContact: contact,
    category: category,
    description: description
  };

  let newComplaint = null;

  // Try live Java / PHP server
  if (state.isServerConnected) {
    try {
      const res = await fetch(apiUrl('api/complaints'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        newComplaint = data.complaint || data;
      }
    } catch (e) {}
  }

  // Fallback offline simulator
  if (!newComplaint) {
    let assignedW = (state.wardens && state.wardens.length > 0) ? state.wardens[0] : DEFAULT_WARDENS[0];
    const upperRoom = room.toUpperCase();
    if (state.wardens && state.wardens.length > 0) {
      for (const w of state.wardens) {
        const bLetter = (w.assignedBlock || '').replace(/block\s*/i, '').trim().toUpperCase();
        if (bLetter && (upperRoom.startsWith(bLetter) || upperRoom.includes('BLOCK ' + bLetter))) {
          assignedW = w;
          break;
        }
      }
    } else {
      if (upperRoom.startsWith('A')) assignedW = DEFAULT_WARDENS[1];
      else if (upperRoom.startsWith('B')) assignedW = DEFAULT_WARDENS[2];
      else if (upperRoom.startsWith('C')) assignedW = DEFAULT_WARDENS[0];
      else if (upperRoom.startsWith('D')) assignedW = DEFAULT_WARDENS[3] || DEFAULT_WARDENS[0];
    }

    newComplaint = {
      id: "CMP" + (Math.floor(Math.random() * 9000) + 1000),
      student: { id: studentId, studentId: studentId, name: name, roomNumber: room, contact: contact, contactNumber: contact },
      category: category,
      description: description,
      status: "ASSIGNED",
      submittedAt: new Date().toISOString(),
      resolvedAt: "",
      assignedWarden: assignedW,
      escalated: false,
      progressRemarks: "",
      resolutionNotes: "",
      rating: 0,
      feedbackComment: "",
      reopenReason: ""
    };
  }

  // Ensure newComplaint has consistent student fields
  if (!newComplaint.student) {
    newComplaint.student = { id: studentId, studentId: studentId, name: name, roomNumber: room, contact: contact };
  } else {
    if (!newComplaint.student.studentId) newComplaint.student.studentId = newComplaint.student.id || studentId;
    if (!newComplaint.student.id) newComplaint.student.id = studentId;
  }

  // ALWAYS update state.complaints and save locally
  state.complaints = state.complaints.filter(c => c.id !== newComplaint.id);
  state.complaints.unshift(newComplaint);
  saveLocalData();

  // Remember student info for immediate tracking
  state.lastSubmittedId = newComplaint.id;
  sessionStorage.setItem('vresolve_last_student_id', studentId);
  localStorage.setItem('vresolve_last_student_id', studentId);
  sessionStorage.setItem('vresolve_last_ticket_id', newComplaint.id);
  localStorage.setItem('vresolve_last_ticket_id', newComplaint.id);

  // Pre-fill the search input in the Track tab
  const searchInput = document.getElementById('studentSearchInput');
  if (searchInput) {
    searchInput.value = studentId;
  }

  // Reset form inputs
  const form = document.getElementById('lodgeGrievanceForm');
  if (form) form.reset();
  const hintEl = document.getElementById('blockDetectHint');
  if (hintEl) hintEl.textContent = '';

  // Display submission confirmation card on mobile & desktop
  const successCard = document.getElementById('lodgeSuccessCard');
  if (successCard) {
    const ticketIdEl = document.getElementById('successTicketId');
    if (ticketIdEl) ticketIdEl.textContent = newComplaint.id;

    const wardenName = newComplaint.assignedWarden ? newComplaint.assignedWarden.name : 'Hostel Office';
    const wardenBlock = newComplaint.assignedWarden ? (newComplaint.assignedWarden.assignedBlock || '') : '';
    const wardenEl = document.getElementById('successWardenText');
    if (wardenEl) {
      wardenEl.innerHTML = `Assigned to <strong>${escapeHtml(wardenName)} (${escapeHtml(wardenBlock)})</strong> under 24-Hour SLA. SMS dispatched to <strong>${escapeHtml(contact)}</strong>.`;
    }
    successCard.classList.remove('hidden');
    successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Trigger Telco SMS Simulation
  const smsMessage = `Dear ${name}, your grievance ${newComplaint.id} regarding ${category} in Room ${room} has been registered under 24h SLA. Assigned: ${newComplaint.assignedWarden ? newComplaint.assignedWarden.name : 'Hostel Office'}.`;
  triggerSmsPush(contact, smsMessage);

  showToast(`Grievance ${newComplaint.id} lodged successfully! SMS dispatched to ${contact}.`, 'success');
};

window.goToTrackMyGrievance = function() {
  switchStudentTab('track');
  const searchInput = document.getElementById('studentSearchInput');
  const lastRoll = sessionStorage.getItem('vresolve_last_student_id') || localStorage.getItem('vresolve_last_student_id') || (state.lastSubmittedId || '');
  if (searchInput && (!searchInput.value || searchInput.value.trim() === '')) {
    searchInput.value = lastRoll;
  }
  executeStudentTrackSearch();
};

window.lodgeAnotherComplaint = function() {
  const successCard = document.getElementById('lodgeSuccessCard');
  if (successCard) successCard.classList.add('hidden');
  const form = document.getElementById('lodgeGrievanceForm');
  if (form) {
    form.reset();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// ============================================================================
// ISOLATED STUDENT TRACKING
// ============================================================================

window.executeStudentTrackSearch = async function() {
  const container = document.getElementById('studentTrackList');
  const searchInput = document.getElementById('studentSearchInput');
  let query = (searchInput ? searchInput.value : '').trim();

  // If query is empty, try retrieving last saved student ID
  if (!query) {
    const savedId = sessionStorage.getItem('vresolve_last_student_id') || localStorage.getItem('vresolve_last_student_id') || sessionStorage.getItem('vresolve_last_ticket_id');
    if (savedId) {
      query = savedId;
      if (searchInput) searchInput.value = query;
    }
  }

  if (!query) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748b; background: #fff; border-radius: 10px; border: 1px dashed #cbd5e1;">
        <p style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔍</p>
        <p style="font-size: 0.95rem;">Enter your <strong>Student Roll Number</strong>, <strong>Room Number</strong>, or <strong>Ticket ID</strong> above to track resolution progress.</p>
      </div>`;
    return;
  }

  let results = [];

  // Live Server Isolated Student Tracking
  if (state.isServerConnected) {
    try {
      const res = await fetch(apiUrl('api/student/track?query=' + encodeURIComponent(query)));
      if (res.ok) {
        results = await res.json();
      }
    } catch (e) {}
  }

  // Fallback local search or combine with local complaints
  const qLower = query.toLowerCase();
  const localMatches = state.complaints.filter(c => {
    const idMatch = c.id && c.id.toLowerCase().includes(qLower);
    const rollMatch = c.student && (
      (c.student.studentId && c.student.studentId.toLowerCase().includes(qLower)) ||
      (c.student.id && c.student.id.toLowerCase().includes(qLower))
    );
    const roomMatch = c.student && c.student.roomNumber && c.student.roomNumber.toLowerCase().includes(qLower);
    const nameMatch = c.student && c.student.name && c.student.name.toLowerCase().includes(qLower);
    return idMatch || rollMatch || roomMatch || nameMatch;
  });

  // Merge results, avoiding duplicates
  const seenIds = new Set(results.map(r => r.id));
  localMatches.forEach(c => {
    if (!seenIds.has(c.id)) {
      results.push(c);
      seenIds.add(c.id);
    }
  });

  // Exclude 1-week-old solved and rated complaints from general resident tracking
  const isTicketIdSearch = query.toUpperCase().startsWith('CMP');
  if (!isTicketIdSearch) {
    results = results.filter(c => !isOlderThanOneWeek(c));
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; color: #64748b;">
        <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</p>
        <h4 style="color: #0f2b5c; margin-bottom: 0.35rem;">No Grievance Records Found</h4>
        <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto;">
          No complaints found matching "<strong>${escapeHtml(query)}</strong>". Please double check your Roll Number, Room Number, or Ticket ID.
        </p>
      </div>`;
    return;
  }

  container.innerHTML = results.map(c => renderStudentTicketCard(c)).join('');
};

// ============================================================================
// SLA TIMER & EXPIRY HELPERS (24-HOUR SLA & 1-WEEK AUTO-REMOVAL)
// ============================================================================

const ONE_WEEK_MILLIS = 7 * 24 * 3600 * 1000;
const SLA_LIMIT_MILLIS = 24 * 3600 * 1000;

function isSolvedAndRated(c) {
  return (c.status === 'CONFIRMED' || (c.status === 'RESOLVED' && c.rating > 0) || (c.rating > 0 && c.resolvedAt));
}

function isOlderThanOneWeek(c) {
  if (!isSolvedAndRated(c)) return false;
  if (!c.resolvedAt) return false;
  const resolvedTime = new Date(c.resolvedAt).getTime();
  if (isNaN(resolvedTime)) return false;
  return (Date.now() - resolvedTime) > ONE_WEEK_MILLIS;
}

function isSlaBreached(c) {
  if (c.status === 'RESOLVED' || c.status === 'CONFIRMED') return false;
  if (c.escalated || c.status === 'ESCALATED') return true;
  if (!c.submittedAt) return false;
  const subTime = new Date(c.submittedAt).getTime();
  if (isNaN(subTime)) return false;
  return (Date.now() - subTime) >= SLA_LIMIT_MILLIS;
}

function getSlaTimerInfo(c) {
  if (c.status === 'RESOLVED' || c.status === 'CONFIRMED') {
    return {
      isResolved: true,
      isBreached: false,
      text: '✓ Resolved',
      className: 'timer-active'
    };
  }
  const subTime = new Date(c.submittedAt).getTime();
  if (isNaN(subTime)) {
    return { isResolved: false, isBreached: false, text: '⏱️ SLA Active', className: 'timer-active' };
  }
  const elapsed = Date.now() - subTime;
  if (elapsed >= SLA_LIMIT_MILLIS || c.escalated || c.status === 'ESCALATED') {
    const hoursOver = Math.floor((elapsed - SLA_LIMIT_MILLIS) / (3600 * 1000));
    return {
      isResolved: false,
      isBreached: true,
      text: `🚨 SLA BREACH: +${hoursOver}h Overdue`,
      className: 'timer-breached'
    };
  }
  const remaining = SLA_LIMIT_MILLIS - elapsed;
  const hours = Math.floor(remaining / (3600 * 1000));
  const mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
  const secs = Math.floor((remaining % (60 * 1000)) / 1000);
  const className = hours < 6 ? 'timer-warning' : 'timer-active';
  return {
    isResolved: false,
    isBreached: false,
    text: `⏱️ SLA: ${hours}h ${mins}m ${secs}s left`,
    className
  };
}

function renderStudentTicketCard(c) {
  const timer = getSlaTimerInfo(c);
  const breached = isSlaBreached(c);
  const isResolved = c.status === 'RESOLVED';
  const isConfirmed = c.status === 'CONFIRMED' || c.rating > 0;

  let slaBadge = '';
  if (isConfirmed) {
    slaBadge = `<span class="badge badge-RESOLVED">✓ Resolution Confirmed</span>`;
  } else if (isResolved) {
    slaBadge = `<span class="badge badge-RESOLVED" style="background: #059669; color: #fff;">✓ Work Completed (Pending Your Rating)</span>`;
  } else if (breached) {
    slaBadge = `<span class="sla-breach-pulse">🚨 SLA BREACH: Exceeded 24h &bull; Deanery Escalated</span>`;
  } else {
    slaBadge = `<span class="timer-live-badge ${timer.className}" data-sla-timer-id="${c.id}">${timer.text}</span>`;
  }

  let ratingCard = '';
  if (isResolved && !isConfirmed) {
    ratingCard = `
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #16a34a; border-radius: 10px; padding: 1.25rem; margin-top: 1rem; text-align: center;">
        <div style="font-size: 1.6rem; margin-bottom: 0.25rem;">🛠️ 🎉</div>
        <div style="font-weight: 800; color: #15803d; font-size: 1.05rem;">
          Problem Marked Resolved by Supervisor!
        </div>
        <p style="font-size: 0.88rem; color: #166534; margin: 0.35rem auto 0.85rem auto; max-width: 500px;">
          Supervisor <strong>${c.assignedWarden ? escapeHtml(c.assignedWarden.name) : 'Hostel Office'}</strong> has completed repair work. Please rate the service quality to confirm resolution.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button onclick="openRateModal('${c.id}')" class="btn btn-sm" style="background: #16a34a; color: #fff; border: none; font-size: 0.95rem; font-weight: 700; padding: 0.6rem 1.5rem; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);">
            ⭐ Rate Quality of Work (1 - 5 Stars)
          </button>
          <button onclick="openReopenModal('${c.id}')" class="btn btn-sm" style="background: #ffffff; color: #ea580c; border: 1px solid #ea580c; font-size: 0.88rem; font-weight: 600; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer;">
            ↺ Issue Still Persists? Reopen Ticket
          </button>
        </div>
      </div>
    `;
  } else if (isConfirmed) {
    ratingCard = `
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 0.85rem 1.25rem; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="font-size: 0.9rem; font-weight: 800; color: #b45309; display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-size: 1.2rem; color: #f59e0b;">${'★'.repeat(c.rating || 5)}${'☆'.repeat(5 - (c.rating || 5))}</span>
            <span>Student Rating: ${c.rating || 5} / 5 Stars</span>
          </div>
          ${c.feedbackComment ? `<div style="font-size: 0.82rem; color: #78350f; font-style: italic; margin-top: 0.25rem;">"${escapeHtml(c.feedbackComment)}"</div>` : ''}
        </div>
        <span style="background: #dcfce7; color: #15803d; padding: 0.3rem 0.75rem; border-radius: 9999px; font-weight: 700; font-size: 0.78rem;">✓ Work Confirmed by Resident</span>
      </div>
    `;
  }

  return `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); ${breached ? 'border-left: 5px solid #dc2626;' : ''}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
            <strong style="color: #1d4ed8; font-family: monospace; font-size: 1.05rem;">${c.id}</strong>
            <span class="badge badge-${c.status}">${c.status}</span>
            <span style="font-size: 0.75rem; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; color: #475569;">${c.category}</span>
          </div>
          <div style="font-size: 0.82rem; color: #64748b;">
            Lodged: ${new Date(c.submittedAt).toLocaleString()} &bull; Room: <strong>${c.student ? c.student.roomNumber : ''}</strong>
          </div>
        </div>
        <div>${slaBadge}</div>
      </div>

      <p style="color: #1e293b; font-size: 0.95rem; margin-bottom: 0.75rem; line-height: 1.5;">${escapeHtml(c.description)}</p>

      ${c.progressRemarks ? `
        <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #92400e; margin-bottom: 0.75rem;">
          <strong>Supervisor Progress:</strong> ${escapeHtml(c.progressRemarks)}
        </div>` : ''}

      ${c.resolutionNotes ? `
        <div style="background: #ecfdf5; border-left: 3px solid #10b981; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #065f46; margin-bottom: 0.75rem;">
          <strong>Resolution Details:</strong> ${escapeHtml(c.resolutionNotes)}
        </div>` : ''}

      ${ratingCard}

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9;">
        <div style="font-size: 0.82rem; color: #64748b;">
          Assigned Supervisor: <strong>${c.assignedWarden ? c.assignedWarden.name : 'Hostel Office'}</strong>
          ${c.assignedWarden ? `&bull; ${c.assignedWarden.assignedBlock}` : ''}
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <!-- PRINT DOCKET BUTTON -->
          <button onclick="generateDocketModal('${c.id}')" class="btn btn-sm btn-ghost" style="border: 1px solid #cbd5e1; background: #f8fafc; font-size: 0.8rem;">
            📄 Print Official Docket (PDF)
          </button>
        </div>
      </div>
    </div>
  `;
}

function calculateSlaHours(submittedAtStr) {
  try {
    const sub = new Date(submittedAtStr).getTime();
    const now = Date.now();
    const elapsedMillis = now - sub;
    const remainingMillis = 24 * 3600 * 1000 - elapsedMillis;
    return Math.max(0, Math.round(remainingMillis / (3600 * 1000)));
  } catch (e) {
    return 24;
  }
}

// ============================================================================
// HOSTEL WARDEN DESK (MAIN PAGE VIEW)
// ============================================================================

window.setMainWardenFilter = function(f) {
  state.mainWardenFilter = f;
  document.getElementById('mwfBtnAll').style.background = f === 'ALL' ? '#0d9488' : '#f1f5f9';
  document.getElementById('mwfBtnAll').style.color = f === 'ALL' ? '#fff' : '#334155';
  document.getElementById('mwfBtnActive').style.background = f === 'ACTIVE' ? '#0d9488' : '#f1f5f9';
  document.getElementById('mwfBtnActive').style.color = f === 'ACTIVE' ? '#fff' : '#334155';
  document.getElementById('mwfBtnResolved').style.background = f === 'RESOLVED' ? '#0d9488' : '#f1f5f9';
  document.getElementById('mwfBtnResolved').style.color = f === 'RESOLVED' ? '#fff' : '#334155';
  renderMainWardenDesk();
};

function renderMainWardenDesk() {
  const container = document.getElementById('mainWardenTicketsContainer');
  const headingEl = document.getElementById('wardenSectionHeading');
  const scopeEl = document.getElementById('wardenSectionScope');
  const countEl = document.getElementById('mainWardenCountText');

  if (!state.currentUser) return;

  headingEl.textContent = `${state.currentUser.name}'s Desk`;
  scopeEl.textContent = `Jurisdiction: ${state.currentUser.assignedBlock} &bull; Work Order Queue`;

  let list = state.complaints.filter(c => !isOlderThanOneWeek(c));

  if (state.currentUser.assignedBlock && state.currentUser.assignedBlock !== 'All Blocks') {
    const userBlock = (state.currentUser.assignedBlock || '').trim();
    const blockLetter = userBlock.replace(/block\s*/i, '').trim().toUpperCase();
    const userId = (state.currentUser.id || '').toUpperCase();
    const userName = (state.currentUser.name || '').toLowerCase();

    list = list.filter(c => {
      // 1. Direct assignment to warden ID
      if (c.assignedWarden && c.assignedWarden.id && String(c.assignedWarden.id).toUpperCase() === userId) return true;
      // 2. Assignment by warden name
      if (c.assignedWarden && c.assignedWarden.name && String(c.assignedWarden.name).toLowerCase() === userName) return true;
      // 3. Assignment by block name match (e.g. Block A)
      if (c.assignedWarden && c.assignedWarden.assignedBlock && c.assignedWarden.assignedBlock.toLowerCase() === userBlock.toLowerCase()) return true;
      if (c.assignedBlock && c.assignedBlock.toLowerCase() === userBlock.toLowerCase()) return true;
      // 4. Room prefix / contains match (e.g. room "A-204" or "Block A-204" matches Block A)
      if (c.student && c.student.roomNumber) {
        const r = c.student.roomNumber.toUpperCase();
        if (blockLetter && (
          r.startsWith(blockLetter) || 
          r.includes('BLOCK ' + blockLetter) || 
          r.includes('BLOCK-' + blockLetter) ||
          r.includes(blockLetter + '-') ||
          r.includes(blockLetter + ' ')
        )) return true;
      }
      return false;
    });
  }

  if (state.mainWardenFilter === 'ACTIVE') {
    list = list.filter(c => c.status !== 'RESOLVED' && c.status !== 'CONFIRMED');
  } else if (state.mainWardenFilter === 'RESOLVED') {
    list = list.filter(c => c.status === 'RESOLVED' || c.status === 'CONFIRMED');
  }

  countEl.textContent = `Showing ${list.length} tickets in ${state.currentUser.assignedBlock}`;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="background: #fff; padding: 3rem; text-align: center; border-radius: 8px; border: 1px solid #e2e8f0; color: #64748b;">
        <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">👍</p>
        <h4 style="color: #0f2b5c; margin-bottom: 0.25rem;">No Grievances Found</h4>
        <p style="font-size: 0.9rem;">There are no tickets matching this filter for your block.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(c => {
    const timer = getSlaTimerInfo(c);
    const breached = isSlaBreached(c);

    let statusDisplay = `<span class="badge badge-${c.status}">${c.status}</span>`;
    if (breached) {
      statusDisplay = `<span class="sla-breach-pulse">⚠️ SLA BREACH (>24h)</span>`;
    }

    return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; ${breached ? 'border-left: 5px solid #dc2626;' : ''}">
        <div style="flex: 1; min-width: 280px;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; flex-wrap: wrap;">
            <strong style="color: #0d9488; font-family: monospace; font-size: 1rem;">${c.id}</strong>
            ${statusDisplay}
            <span class="timer-live-badge ${timer.className}" data-sla-timer-id="${c.id}">${timer.text}</span>
            <span style="font-size: 0.75rem; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; color: #475569;">${c.category}</span>
          </div>
          <p style="margin: 0.4rem 0; font-weight: 500; color: #1e293b; font-size: 0.95rem;">${escapeHtml(c.description)}</p>
          <div style="font-size: 0.82rem; color: #64748b; display: flex; gap: 1.25rem; flex-wrap: wrap; margin-top: 0.5rem;">
            <span>👤 Resident: <strong>${c.student ? escapeHtml(c.student.name) : 'Unknown'}</strong> (${c.student ? c.student.studentId : ''})</span>
            <span>🚪 Room: <strong>${c.student ? c.student.roomNumber : ''}</strong></span>
            <span>📞 Contact: <strong>${c.student ? c.student.contact : ''}</strong></span>
            <span>📅 Lodged: ${new Date(c.submittedAt).toLocaleDateString()}</span>
          </div>
          ${c.resolutionNotes ? `<div style="margin-top: 0.6rem; background: #ecfdf5; border-left: 3px solid #10b981; padding: 0.4rem 0.6rem; font-size: 0.82rem; color: #065f46;"><strong>Resolution:</strong> ${escapeHtml(c.resolutionNotes)}</div>` : ''}
          ${c.rating > 0 ? `
            <div style="margin-top: 0.6rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #b45309;">
              <strong>⭐ Student Rating:</strong> ${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)} (${c.rating}/5 Stars)
              ${c.feedbackComment ? `<div style="margin-top: 0.2rem; font-style: italic; color: #78350f;">"${escapeHtml(c.feedbackComment)}"</div>` : ''}
            </div>` : ''}
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button onclick="generateDocketModal('${c.id}')" style="padding: 0.45rem 0.85rem; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; font-size: 0.82rem; cursor: pointer;">
            📄 Docket
          </button>
          ${c.status !== 'RESOLVED' && c.status !== 'CONFIRMED' ? `
            <button onclick="openMainWardenResolveModal('${c.id}')" style="padding: 0.45rem 0.95rem; border: none; background: #059669; color: #fff; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
              ✓ Resolve & Send SMS
            </button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.openMainWardenResolveModal = function(id) {
  state.selectedComplaintIdForModal = id;
  document.getElementById('mwResolveTicketId').textContent = id;
  document.getElementById('mwResolveNotesInput').value = '';
  openModal('mainWardenResolveModal');
};

window.executeMainWardenResolve = async function() {
  const id = state.selectedComplaintIdForModal;
  const notes = document.getElementById('mwResolveNotesInput').value.trim();

  if (!notes) {
    showToast('Please enter resolution notes.', 'error');
    return;
  }

  const payload = {
    id: id,
    complaintId: id,
    wardenId: state.currentUser ? state.currentUser.id : 'W1',
    resolutionNotes: notes,
    token: state.sessionToken
  };

  try {
    const url = apiUrl('api/complaints/resolve') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('mainWardenResolveModal');
      showToast(`Ticket ${id} marked resolved! Automated SMS dispatched to student.`, 'success');
      await loadInitialData();
      renderMainWardenDesk();
      return;
    }
  } catch (e) {}

  const ticket = state.complaints.find(c => c.id === id);
  if (ticket) {
    ticket.status = 'RESOLVED';
    ticket.resolvedAt = new Date().toISOString();
    ticket.resolutionNotes = notes;
    saveLocalData();
    closeModal('mainWardenResolveModal');
    showToast(`Ticket ${id} marked resolved!`, 'success');
    renderMainWardenDesk();
  }
};

// ============================================================================
// DEAN UJJAVAL GUPTA EXECUTIVE DASHBOARD
// ============================================================================

let filterOnlyBreaches = false;

window.toggleFilterSlaBreaches = function() {
  filterOnlyBreaches = !filterOnlyBreaches;
  const btn = document.getElementById('btnFilterBreaches');
  if (btn) {
    btn.textContent = filterOnlyBreaches ? 'Show All Tickets ➔' : 'View Breached Tickets Only ➔';
  }
  renderAdminMasterTable();
};

function getNextWardenId() {
  const all = [...DEFAULT_WARDENS, ...(state.wardens || [])];
  let maxNum = 4;
  all.forEach(w => {
    if (!w || !w.id) return;
    const match = String(w.id).match(/^W(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return 'W' + (maxNum + 1);
}

window.openAddWardenModal = function() {
  document.getElementById('addWardenForm').reset();
  const nextId = getNextWardenId();
  const idEl = document.getElementById('newWardenId');
  if (idEl) {
    idEl.value = nextId;
    idEl.placeholder = `e.g. ${nextId}`;
  }
  openModal('addWardenModal');
};

window.submitAddWarden = async function() {
  let id = (document.getElementById('newWardenId').value || '').trim();
  const name = (document.getElementById('newWardenName').value || '').trim();
  const block = (document.getElementById('newWardenBlock').value || '').trim();
  const phone = (document.getElementById('newWardenPhone').value || '').trim();
  const password = (document.getElementById('newWardenPassword').value || '').trim();

  if (!name || !block) {
    showToast('Please fill all mandatory fields (Name and Block).', 'error');
    return;
  }

  // Auto-generate ID if empty
  if (!id) {
    id = getNextWardenId();
  }

  // Prevent duplicate overwriting: If ID is already taken by existing warden, auto-assign next ID
  if (!state.wardens || state.wardens.length === 0) {
    state.wardens = [...DEFAULT_WARDENS];
  }
  const existingWarden = state.wardens.find(w => String(w.id).trim().toLowerCase() === id.toLowerCase());
  if (existingWarden) {
    const autoId = getNextWardenId();
    showToast(`Notice: ID [${id}] is already used by ${existingWarden.name}. Auto-assigned unique ID: [${autoId}]`, 'info');
    id = autoId;
  }

  const payload = {
    id,
    name,
    assignedBlock: block,
    contactNumber: phone,
    password: password || 'vitbhopal',
    action: 'create',
    isUpdate: false,
    token: state.sessionToken
  };

  const newWardenObj = {
    id,
    name,
    assignedBlock: block,
    contactNumber: phone
  };

  // 1. Immediately append new warden to state.wardens (NEVER overwrite previous wardens)
  state.wardens.push(newWardenObj);
  saveLocalData();

  // 2. Register credentials in local staff accounts cache
  const rawPass = password || 'vitbhopal';
  const passHash = await sha256(rawPass);
  const customAccount = {
    id: id,
    username: id.toLowerCase(),
    name: name,
    role: 'WARDEN',
    assignedBlock: block,
    passwordHash: passHash
  };
  STAFF_ACCOUNTS[id.toLowerCase()] = customAccount;
  STAFF_ACCOUNTS[id.toUpperCase()] = customAccount;

  try {
    const savedCustom = JSON.parse(localStorage.getItem('vresolve_custom_staff_accounts') || '{}');
    savedCustom[id.toLowerCase()] = customAccount;
    savedCustom[id.toUpperCase()] = customAccount;
    localStorage.setItem('vresolve_custom_staff_accounts', JSON.stringify(savedCustom));
  } catch (e) {}

  // 3. Persist to live MySQL database
  if (state.isServerConnected) {
    try {
      const url = apiUrl('api/wardens') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
      const res = await fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`🎉 Warden ${name} (${id}) successfully appointed and saved to SQL Database!`, 'success');
        closeModal('addWardenModal');
        try {
          const wRes = await fetch(apiUrl('api/wardens'));
          if (wRes.ok) {
            const liveWardens = await wRes.json();
            if (Array.isArray(liveWardens) && liveWardens.length > 0) {
              state.wardens = mergeWardens(liveWardens, state.wardens);
              saveLocalData();
            }
          }
        } catch (e) {}
        renderWardenGrid();
        renderAdminDashboard();
        return;
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Saved locally. Server responded with warning.', 'warning');
      }
    } catch (err) {}
  }

  showToast(`Warden ${name} (${id}) appointed successfully!`, 'success');
  closeModal('addWardenModal');
  renderWardenGrid();
  renderAdminDashboard();
};

window.filterByWardenBlock = function(block) {
  const blockSelect = document.getElementById('adminBlockFilter');
  if (blockSelect) {
    blockSelect.value = block;
    renderAdminMasterTable();
    const tableEl = document.getElementById('adminMasterTableBody');
    if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

window.renderWardenGrid = function() {
  const container = document.getElementById('wardenGridContainer');
  if (!container) return;

  const wardens = state.wardens && state.wardens.length > 0 ? state.wardens : DEFAULT_WARDENS;
  const colors = ['#1d4ed8', '#d97706', '#0d9488', '#7c3aed', '#ec4899', '#0284c7'];

  container.innerHTML = wardens.map((w, idx) => {
    const color = colors[idx % colors.length];
    const activeQueue = state.complaints.filter(c => {
      if (c.status === 'RESOLVED' || c.status === 'CONFIRMED') return false;
      if (c.assignedWarden && (c.assignedWarden.id === w.id || c.assignedWarden.name === w.name)) return true;
      if (c.student && c.student.roomNumber && w.assignedBlock && c.student.roomNumber.toUpperCase().startsWith(w.assignedBlock.replace('Block ', ''))) return true;
      return false;
    }).length;

    return `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; border-top: 4px solid ${color}; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
            <div style="font-weight: 800; color: #0f2b5c; font-size: 1rem;">${escapeHtml(w.name)}</div>
            <span style="font-size: 0.72rem; font-family: monospace; background: #ffffff; border: 1px solid #cbd5e1; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 700; color: #475569;">${escapeHtml(w.id)}</span>
          </div>
          <div style="font-size: 0.82rem; color: ${color}; font-weight: 700;">${escapeHtml(w.assignedBlock)} Supervisor</div>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>📞</span> <span>${escapeHtml(w.contactNumber || 'N/A')}</span>
          </div>
        </div>
        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
          <div style="font-size: 0.82rem; color: #334155; font-weight: 700;">
            Active Queue: <span style="color: ${activeQueue > 0 ? '#d97706' : '#059669'}; font-weight: 800;">${activeQueue} tickets</span>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button onclick="filterByWardenBlock('${escapeHtml(w.assignedBlock)}')" class="btn btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.55rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; color: #475569; cursor: pointer;">
              Filter
            </button>
            <button onclick="openEditWardenModal('${escapeHtml(w.id)}')" class="btn btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.55rem; background: #ede9fe; border: 1px solid #ddd6fe; border-radius: 4px; color: #6d28d9; font-weight: 700; cursor: pointer;" title="Modify Name, Block, Phone, or Password">
              ✏️ Modify Details
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Dynamically update adminBlockFilter dropdown options
  const blockSelect = document.getElementById('adminBlockFilter');
  if (blockSelect) {
    const currentVal = blockSelect.value;
    const blocks = Array.from(new Set(wardens.map(w => w.assignedBlock).filter(Boolean)));
    blockSelect.innerHTML = `<option value="ALL">All Blocks</option>` +
      blocks.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
    if (blocks.includes(currentVal)) {
      blockSelect.value = currentVal;
    }
  }
};

// ============================================================================
// WARDEN MODIFICATION & DE-ALLOTMENT (DEAN UJJAVAL GUPTA CONTROL)
// ============================================================================

window.openEditWardenModal = function(id) {
  const wardensList = (state.wardens && state.wardens.length > 0) ? state.wardens : DEFAULT_WARDENS;
  const targetId = String(id || '').trim().toLowerCase();
  const w = wardensList.find(item => String(item.id).trim().toLowerCase() === targetId);
  if (!w) {
    showToast(`Warden record [${id}] not found.`, 'error');
    return;
  }

  document.getElementById('editWardenId').value = w.id;
  document.getElementById('editWardenIdDisplay').textContent = `${w.id} (${w.name})`;
  document.getElementById('editWardenIdDisabled').value = w.id;
  document.getElementById('editWardenName').value = w.name;
  document.getElementById('editWardenBlock').value = w.assignedBlock;
  document.getElementById('editWardenPhone').value = w.contactNumber || '';
  document.getElementById('editWardenPassword').value = '';

  openModal('editWardenModal');
};

window.submitEditWarden = async function() {
  const id = document.getElementById('editWardenId').value.trim();
  const name = document.getElementById('editWardenName').value.trim();
  const block = document.getElementById('editWardenBlock').value.trim();
  const phone = document.getElementById('editWardenPhone').value.trim();
  const password = document.getElementById('editWardenPassword').value.trim();

  if (!id || !name || !block) {
    showToast('Please fill all mandatory fields (Name and Block).', 'error');
    return;
  }

  const payload = {
    id,
    name,
    assignedBlock: block,
    contactNumber: phone,
    password: password || undefined,
    action: 'update',
    isUpdate: true,
    role: 'ADMIN',
    token: state.sessionToken
  };

  // 1. Immediately update client-side state (case-insensitive lookup)
  const targetId = id.toLowerCase();
  if (!state.wardens || state.wardens.length === 0) {
    state.wardens = [...DEFAULT_WARDENS];
  }
  const existingWarden = state.wardens.find(w => String(w.id).trim().toLowerCase() === targetId);
  if (existingWarden) {
    existingWarden.name = name;
    existingWarden.assignedBlock = block;
    existingWarden.contactNumber = phone;
  } else {
    state.wardens.push({ id, name, assignedBlock: block, contactNumber: phone });
  }
  saveLocalData();

  // 2. Update cached credentials in STAFF_ACCOUNTS
  if (password) {
    const passHash = await sha256(password);
    const updatedAccount = {
      id: id,
      username: id.toLowerCase(),
      name: name,
      role: 'WARDEN',
      assignedBlock: block,
      passwordHash: passHash
    };
    STAFF_ACCOUNTS[id.toLowerCase()] = updatedAccount;
    STAFF_ACCOUNTS[id.toUpperCase()] = updatedAccount;

    try {
      const savedCustom = JSON.parse(localStorage.getItem('vresolve_custom_staff_accounts') || '{}');
      savedCustom[id.toLowerCase()] = updatedAccount;
      savedCustom[id.toUpperCase()] = updatedAccount;
      localStorage.setItem('vresolve_custom_staff_accounts', JSON.stringify(savedCustom));
    } catch (e) {}
  } else if (STAFF_ACCOUNTS[id.toLowerCase()]) {
    STAFF_ACCOUNTS[id.toLowerCase()].name = name;
    STAFF_ACCOUNTS[id.toLowerCase()].assignedBlock = block;
    if (STAFF_ACCOUNTS[id.toUpperCase()]) {
      STAFF_ACCOUNTS[id.toUpperCase()].name = name;
      STAFF_ACCOUNTS[id.toUpperCase()].assignedBlock = block;
    }
  }

  // 3. Update active complaints in local state if assigned to this warden
  state.complaints.forEach(c => {
    if (c.assignedWarden && (String(c.assignedWarden.id).toLowerCase() === targetId || c.assignedWarden.name === existingWarden?.name)) {
      c.assignedWarden.name = name;
      c.assignedWarden.assignedBlock = block;
    }
  });
  saveLocalData();

  // 4. Send update to MySQL database
  if (state.isServerConnected) {
    try {
      const url = apiUrl('api/wardens') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
      const res = await fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`🎉 Warden ${name} (${id}) updated successfully in database!`, 'success');
        closeModal('editWardenModal');
        try {
          const wRes = await fetch(apiUrl('api/wardens'));
          if (wRes.ok) {
            const liveWardens = await wRes.json();
            if (Array.isArray(liveWardens) && liveWardens.length > 0) {
              state.wardens = mergeWardens(liveWardens, state.wardens);
              saveLocalData();
            }
          }
        } catch (e) {}
        renderWardenGrid();
        renderAdminDashboard();
        return;
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Notice: Updated locally. Database sync warning.', 'warning');
      }
    } catch (e) {}
  }

  showToast(`Warden ${name} (${id}) details updated!`, 'success');
  closeModal('editWardenModal');
  renderWardenGrid();
  renderAdminDashboard();
};

window.confirmDeleteWarden = async function() {
  const id = document.getElementById('editWardenId').value.trim();
  const name = document.getElementById('editWardenName').value.trim();

  if (!confirm(`Are you sure you want to de-allot and remove Warden ${name} (${id}) from residential operations?`)) {
    return;
  }

  const targetId = id.toLowerCase();
  // 1. Mark in deleted list so mergeWardens doesn't restore it
  try {
    const deleted = getDeletedWardenIds();
    if (!deleted.includes(targetId)) {
      deleted.push(targetId);
      localStorage.setItem('vresolve_deleted_wardens', JSON.stringify(deleted));
    }
  } catch (e) {}

  // 2. Remove from local state
  state.wardens = (state.wardens || []).filter(w => String(w.id).trim().toLowerCase() !== targetId);
  saveLocalData();
  delete STAFF_ACCOUNTS[id.toLowerCase()];
  delete STAFF_ACCOUNTS[id.toUpperCase()];

  try {
    const savedCustom = JSON.parse(localStorage.getItem('vresolve_custom_staff_accounts') || '{}');
    delete savedCustom[id.toLowerCase()];
    delete savedCustom[id.toUpperCase()];
    localStorage.setItem('vresolve_custom_staff_accounts', JSON.stringify(savedCustom));
  } catch (e) {}

  // 3. Send DELETE to MySQL database
  if (state.isServerConnected) {
    try {
      const url = apiUrl('api/wardens') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
      await fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ id, action: 'delete', isDelete: true, role: 'ADMIN', token: state.sessionToken })
      });
    } catch (e) {}
  }

  closeModal('editWardenModal');
  showToast(`Warden ${name} removed successfully.`, 'info');
  renderWardenGrid();
  renderAdminDashboard();
};

// ============================================================================
// REAL TELCO SMS GATEWAY CONFIGURATION & LIVE TEST (DEAN CONTROL)
// ============================================================================

window.openSmsGatewayModal = function() {
  const modal = document.getElementById('smsGatewayModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  const resultBox = document.getElementById('testSmsResultBox');
  if (resultBox) {
    resultBox.classList.add('hidden');
    resultBox.textContent = '';
  }

  // 2. Pre-fill from local cache immediately
  try {
    const cachedCfg = JSON.parse(localStorage.getItem('vresolve_sms_config') || '{}');
    if (cachedCfg.provider) {
      const select = document.getElementById('smsProviderSelect');
      if (select) select.value = cachedCfg.provider;
    }
    if (cachedCfg.fast2smsKey) {
      const el = document.getElementById('cfgFast2smsKey');
      if (el) el.value = cachedCfg.fast2smsKey;
    }
    if (cachedCfg.twilioSid) {
      const el = document.getElementById('cfgTwilioSid');
      if (el) el.value = cachedCfg.twilioSid;
    }
    if (cachedCfg.twilioToken) {
      const el = document.getElementById('cfgTwilioToken');
      if (el) el.value = cachedCfg.twilioToken;
    }
    if (cachedCfg.twilioFrom) {
      const el = document.getElementById('cfgTwilioFrom');
      if (el) el.value = cachedCfg.twilioFrom;
    }
    if (cachedCfg.textlocalKey) {
      const el = document.getElementById('cfgTextlocalKey');
      if (el) el.value = cachedCfg.textlocalKey;
    }
    if (cachedCfg.customUrl) {
      const el = document.getElementById('cfgCustomSmsUrl');
      if (el) el.value = cachedCfg.customUrl;
    }
  } catch (e) {}

  toggleSmsProviderFields();

  // 3. Asynchronously fetch live server configuration & stats
  if (state.isServerConnected) {
    const url = apiUrl('api/sms/config') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
    fetch(url, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.config) {
          const cfg = data.config;
          const select = document.getElementById('smsProviderSelect');
          if (select && cfg.provider) select.value = cfg.provider;
          if (cfg.hasFast2smsKey && cfg.fast2smsKeyMasked) {
            const el = document.getElementById('cfgFast2smsKey');
            if (el && !el.value) el.placeholder = `Active Key: ${cfg.fast2smsKeyMasked} (Enter new to change)`;
          }
          if (cfg.hasTwilio) {
            const sidEl = document.getElementById('cfgTwilioSid');
            if (sidEl && !sidEl.value) sidEl.placeholder = cfg.twilioSidMasked;
            const fromEl = document.getElementById('cfgTwilioFrom');
            if (fromEl && !fromEl.value) fromEl.value = cfg.twilioFrom || '';
          }
          if (cfg.hasTextlocal && cfg.textlocalKeyMasked) {
            const el = document.getElementById('cfgTextlocalKey');
            if (el && !el.value) el.placeholder = cfg.textlocalKeyMasked;
          }
          if (cfg.customUrl) {
            const el = document.getElementById('cfgCustomSmsUrl');
            if (el && !el.value) el.value = cfg.customUrl;
          }

          // Update active banner
          const title = document.getElementById('smsActiveStatusTitle');
          const desc = document.getElementById('smsActiveStatusDesc');
          const badge = document.getElementById('smsStatusBadge');
          if (cfg.hasFast2smsKey || cfg.hasTwilio || cfg.hasTextlocal) {
            if (title) title.textContent = `Active Provider: ${cfg.provider}`;
            if (desc) desc.textContent = `Real SMS is ACTIVE. Total real messages sent: ${data.stats ? data.stats.realDelivered : 0}`;
            if (badge) {
              badge.style.background = '#16a34a';
              badge.textContent = 'LIVE REAL SMS';
            }
          } else {
            if (title) title.textContent = 'Active Mode: Telco Simulator (No Real API Key)';
            if (desc) desc.textContent = 'Enter Fast2SMS or Twilio API key below to activate real SMS delivery to students\' phones.';
            if (badge) {
              badge.style.background = '#f59e0b';
              badge.textContent = 'SIMULATION MODE';
            }
          }
          toggleSmsProviderFields();
        }
      })
      .catch(() => {});
  }
};

window.toggleSmsProviderFields = function() {
  const provider = document.getElementById('smsProviderSelect').value;
  const fFast = document.getElementById('fast2smsFields');
  const fTwilio = document.getElementById('twilioFields');
  const fTextlocal = document.getElementById('textlocalFields');
  const fCustom = document.getElementById('customSmsFields');

  if (fFast) fFast.classList.toggle('hidden', provider !== 'FAST2SMS');
  if (fTwilio) fTwilio.classList.toggle('hidden', provider !== 'TWILIO');
  if (fTextlocal) fTextlocal.classList.toggle('hidden', provider !== 'TEXTLOCAL');
  if (fCustom) fCustom.classList.toggle('hidden', provider !== 'CUSTOM');
};

window.submitSaveSmsConfig = async function() {
  const provider = document.getElementById('smsProviderSelect').value;
  const fast2smsKey = document.getElementById('cfgFast2smsKey').value.trim();
  const twilioSid = document.getElementById('cfgTwilioSid').value.trim();
  const twilioToken = document.getElementById('cfgTwilioToken').value.trim();
  const twilioFrom = document.getElementById('cfgTwilioFrom').value.trim();
  const textlocalKey = document.getElementById('cfgTextlocalKey').value.trim();
  const customUrl = document.getElementById('cfgCustomSmsUrl').value.trim();

  // Save to localStorage immediately so configuration is permanently retained
  const cached = JSON.parse(localStorage.getItem('vresolve_sms_config') || '{}');
  const newConfig = {
    provider,
    fast2smsKey: fast2smsKey || cached.fast2smsKey || '',
    twilioSid: twilioSid || cached.twilioSid || '',
    twilioToken: twilioToken || cached.twilioToken || '',
    twilioFrom: twilioFrom || cached.twilioFrom || '',
    textlocalKey: textlocalKey || cached.textlocalKey || '',
    customUrl: customUrl || cached.customUrl || ''
  };
  localStorage.setItem('vresolve_sms_config', JSON.stringify(newConfig));

  const payload = {
    ...newConfig,
    role: 'ADMIN',
    token: state.sessionToken
  };

  try {
    const url = apiUrl('api/sms/config') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      showToast('🎉 Real SMS gateway configuration saved successfully!', 'success');
      closeModal('smsGatewayModal');
      return;
    }
  } catch (e) {}

  showToast('SMS configuration saved successfully!', 'success');
  closeModal('smsGatewayModal');
};

window.executeRealSmsTest = async function() {
  const phone = (document.getElementById('testSmsPhoneNumber').value || '').trim();
  const resultBox = document.getElementById('testSmsResultBox');

  if (!phone) {
    showToast('Please enter a phone number to test.', 'error');
    return;
  }

  // Auto-capture current form values so testing automatically sends and saves credentials
  const provider = document.getElementById('smsProviderSelect') ? document.getElementById('smsProviderSelect').value : 'FAST2SMS';
  const fast2smsKey = (document.getElementById('cfgFast2smsKey')?.value || '').trim();
  const twilioSid = (document.getElementById('cfgTwilioSid')?.value || '').trim();
  const twilioToken = (document.getElementById('cfgTwilioToken')?.value || '').trim();
  const twilioFrom = (document.getElementById('cfgTwilioFrom')?.value || '').trim();
  const textlocalKey = (document.getElementById('cfgTextlocalKey')?.value || '').trim();
  const customUrl = (document.getElementById('cfgCustomSmsUrl')?.value || '').trim();

  // Save to localStorage immediately so configuration is permanently retained
  const cached = JSON.parse(localStorage.getItem('vresolve_sms_config') || '{}');
  const updatedCfg = {
    provider,
    fast2smsKey: fast2smsKey || cached.fast2smsKey || '',
    twilioSid: twilioSid || cached.twilioSid || '',
    twilioToken: twilioToken || cached.twilioToken || '',
    twilioFrom: twilioFrom || cached.twilioFrom || '',
    textlocalKey: textlocalKey || cached.textlocalKey || '',
    customUrl: customUrl || cached.customUrl || ''
  };
  localStorage.setItem('vresolve_sms_config', JSON.stringify(updatedCfg));

  resultBox.className = 'alert alert-info';
  resultBox.style.background = '#e0f2fe';
  resultBox.style.border = '1px solid #7dd3fc';
  resultBox.style.color = '#0369a1';
  resultBox.innerHTML = `🚀 Dispatching test SMS to <strong>${escapeHtml(phone)}</strong> via <strong>${escapeHtml(provider)}</strong>...`;
  resultBox.classList.remove('hidden');

  try {
    const url = apiUrl('api/sms/test') + (state.sessionToken ? '?token=' + encodeURIComponent(state.sessionToken) : '');
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        phoneNumber: phone,
        provider: provider,
        fast2smsKey: fast2smsKey || cached.fast2smsKey || '',
        twilioSid: twilioSid || cached.twilioSid || '',
        twilioToken: twilioToken || cached.twilioToken || '',
        twilioFrom: twilioFrom || cached.twilioFrom || '',
        textlocalKey: textlocalKey || cached.textlocalKey || '',
        customUrl: customUrl || cached.customUrl || '',
        role: 'ADMIN',
        token: state.sessionToken
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      resultBox.className = 'alert alert-success';
      resultBox.style.background = '#dcfce7';
      resultBox.style.border = '1px solid #86efac';
      resultBox.style.color = '#15803d';
      resultBox.innerHTML = `✅ <strong>REAL SMS DELIVERED!</strong> ${escapeHtml(data.message)}<br><small style="margin-top:4px;display:block;">Check your mobile handset right now!</small>`;
      showToast('Real test SMS sent to ' + phone, 'success');

      // Update badge and status in modal
      const badge = document.getElementById('smsStatusBadge');
      if (badge) {
        badge.style.background = '#16a34a';
        badge.textContent = 'LIVE REAL SMS';
      }
      const title = document.getElementById('smsActiveStatusTitle');
      if (title) title.textContent = `Active Provider: ${data.provider || provider}`;
      const desc = document.getElementById('smsActiveStatusDesc');
      if (desc) desc.textContent = 'Real SMS is LIVE & VERIFIED. Students and wardens will receive actual SMS on their mobile numbers.';
    } else {
      resultBox.className = 'alert alert-warning';
      resultBox.style.background = '#fef3c7';
      resultBox.style.border = '1px solid #fcd34d';
      resultBox.style.color = '#92400e';
      const msg = data.message || data.error || 'SMS test simulated.';
      let helpTip = '';
      if (msg.toLowerCase().includes('authorization key') || msg.toLowerCase().includes('authentication') || msg.toLowerCase().includes('api key')) {
        helpTip = '<div style="margin-top: 6px; font-size: 0.76rem; color: #b45309;">⚠️ <strong>API Key Issue:</strong> Please log in to <a href="https://www.fast2sms.com" target="_blank" style="font-weight:700; color:#92400e; text-decoration:underline;">fast2sms.com</a> ➔ <strong>Dev API</strong> ➔ Copy your <strong>Authorization Key</strong> in full (ensure no characters are missing) and paste it into the box above.</div>';
      }
      resultBox.innerHTML = `ℹ️ <strong>Status:</strong> ${escapeHtml(msg)}${helpTip}`;
      showToast(data.message || data.error || 'SMS Gateway returned a notice.', 'warning');
    }
  } catch (err) {
    resultBox.className = 'alert alert-warning';
    resultBox.style.background = '#fef3c7';
    resultBox.style.border = '1px solid #fcd34d';
    resultBox.style.color = '#92400e';
    resultBox.innerHTML = `ℹ️ <strong>Notice:</strong> Network test completed in simulation mode. Check internet connectivity.`;
  }
};

function renderAdminDashboard() {
  const total = state.complaints.length;
  const resolved = state.complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CONFIRMED').length;
  const pending = state.complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS' || c.status === 'SUBMITTED').length;
  
  // Breached unresolved complaints (>24 hours)
  const breachedCount = state.complaints.filter(c => isSlaBreached(c)).length;
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  document.getElementById('admStatTotal').textContent = total;
  document.getElementById('admStatResolved').textContent = resolved;
  document.getElementById('admStatResolvedPct').textContent = `${resolvedPct}% resolution efficiency`;
  document.getElementById('admStatPending').textContent = pending;
  document.getElementById('admStatEscalated').textContent = breachedCount;

  // Show / hide urgent SLA breach banner
  const banner = document.getElementById('admSlaBreachBanner');
  if (banner) {
    if (breachedCount > 0) {
      banner.classList.remove('hidden');
      document.getElementById('admSlaBreachCountText').textContent = breachedCount;
    } else {
      banner.classList.add('hidden');
    }
  }

  renderWardenGrid();
  renderAdminMasterTable();
}

window.renderAdminMasterTable = function() {
  const blockFilter = document.getElementById('adminBlockFilter').value;
  const catFilter = document.getElementById('adminCategoryFilter').value;
  const search = (document.getElementById('adminTableSearch').value || '').trim().toLowerCase();
  const showArchived = document.getElementById('toggleShowArchived') ? document.getElementById('toggleShowArchived').checked : false;
  const tbody = document.getElementById('adminMasterTableBody');

  let list = state.complaints;

  // Count 1-week archived records
  const totalArchivedCount = list.filter(c => isOlderThanOneWeek(c)).length;
  const labelArchived = document.getElementById('labelArchivedText');
  if (labelArchived) {
    labelArchived.textContent = `📁 Show Archived (>1 week) (${totalArchivedCount})`;
  }

  // Remove solved & rated tickets older than 1 week by default
  if (!showArchived) {
    list = list.filter(c => !isOlderThanOneWeek(c));
  }

  // Filter only breaches if active
  if (filterOnlyBreaches) {
    list = list.filter(c => isSlaBreached(c));
  }

  if (blockFilter !== 'ALL') {
    list = list.filter(c => {
      if (c.assignedWarden && c.assignedWarden.assignedBlock === blockFilter) return true;
      if (c.student && c.student.roomNumber && c.student.roomNumber.toUpperCase().startsWith(blockFilter.replace('Block ', ''))) return true;
      return false;
    });
  }

  if (catFilter !== 'ALL') {
    list = list.filter(c => c.category === catFilter);
  }

  if (search) {
    list = list.filter(c => {
      const idMatch = c.id && c.id.toLowerCase().includes(search);
      const nameMatch = c.student && c.student.name && c.student.name.toLowerCase().includes(search);
      const rollMatch = c.student && c.student.studentId && c.student.studentId.toLowerCase().includes(search);
      const roomMatch = c.student && c.student.roomNumber && c.student.roomNumber.toLowerCase().includes(search);
      return idMatch || nameMatch || rollMatch || roomMatch;
    });
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 2.5rem; color: #64748b;">
          No registered grievance records matching filter criteria.
        </td>
      </tr>`;
    return;
  }

  // Sort: Unresolved SLA Breaches first!
  list.sort((a, b) => {
    const aBreach = isSlaBreached(a) ? 1 : 0;
    const bBreach = isSlaBreached(b) ? 1 : 0;
    if (aBreach !== bBreach) {
      return bBreach - aBreach;
    }
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  tbody.innerHTML = list.map(c => {
    const breached = isSlaBreached(c);
    const archived = isOlderThanOneWeek(c);
    const timer = getSlaTimerInfo(c);

    let rowClass = '';
    if (breached) rowClass = 'row-sla-breach';
    else if (archived) rowClass = 'row-archived';

    let statusDisplay = `<span class="badge badge-${c.status}">${c.status}</span>`;
    if (breached) {
      statusDisplay = `<span class="sla-breach-pulse">⚠️ SLA BREACH (>24h)</span>`;
    }

    let ratingDisplay = '';
    if (c.rating > 0) {
      ratingDisplay = `
        <div style="font-weight: 800; color: #d97706; font-size: 0.82rem; margin-bottom: 0.2rem;">
          ⭐ ${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)} (${c.rating}/5)
        </div>
        ${c.feedbackComment ? `<div style="font-size: 0.75rem; color: #475569; font-style: italic;">"${escapeHtml(c.feedbackComment)}"</div>` : ''}
      `;
    } else if (c.resolutionNotes) {
      ratingDisplay = `<div style="font-size: 0.78rem; color: #047857;"><strong>Work:</strong> ${escapeHtml(c.resolutionNotes)}</div>`;
    } else if (c.progressRemarks) {
      ratingDisplay = `<div style="font-size: 0.78rem; color: #b45309;"><strong>Progress:</strong> ${escapeHtml(c.progressRemarks)}</div>`;
    } else {
      ratingDisplay = `<div style="font-size: 0.78rem; color: #64748b; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(c.description)}</div>`;
    }

    return `
      <tr class="${rowClass}" style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
        <td style="padding: 0.65rem 0.6rem; font-family: monospace; font-weight: 700; color: ${breached ? '#dc2626' : '#1d4ed8'};">
          ${c.id}
          ${archived ? '<div style="font-size: 0.65rem; color: #64748b;">[Archived >1w]</div>' : ''}
        </td>
        <td style="padding: 0.65rem 0.6rem; font-weight: 600; color: #0f172a;">${c.student ? escapeHtml(c.student.name) : 'Unknown'}</td>
        <td style="padding: 0.65rem 0.6rem; font-family: monospace; color: #475569;">${c.student ? escapeHtml(c.student.studentId) : '--'}</td>
        <td style="padding: 0.65rem 0.6rem; font-weight: 700; color: #1e293b;">${c.student ? escapeHtml(c.student.roomNumber) : '--'}</td>
        <td style="padding: 0.65rem 0.6rem; font-family: monospace; color: #047857;">${c.student ? escapeHtml(c.student.contact) : '--'}</td>
        <td style="padding: 0.65rem 0.6rem;"><span style="font-size: 0.75rem; background: #f1f5f9; padding: 0.2rem 0.45rem; border-radius: 4px; font-weight: 600; color: #475569;">${c.category}</span></td>
        <td style="padding: 0.65rem 0.6rem;">
          ${statusDisplay}
          <div style="margin-top: 0.25rem;">
            <span class="timer-live-badge ${timer.className}" data-sla-timer-id="${c.id}">${timer.text}</span>
          </div>
        </td>
        <td style="padding: 0.65rem 0.6rem; color: #334155; font-weight: 600;">
          ${c.assignedWarden ? escapeHtml(c.assignedWarden.name) : 'Unassigned'}
          <div style="font-size: 0.72rem; color: #64748b; font-weight: normal;">${c.assignedWarden ? escapeHtml(c.assignedWarden.assignedBlock) : ''}</div>
        </td>
        <td style="padding: 0.65rem 0.6rem; max-width: 220px;">
          ${ratingDisplay}
        </td>
        <td style="padding: 0.65rem 0.6rem; text-align: center;">
          <button onclick="generateDocketModal('${c.id}')" class="btn btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 4px; cursor: pointer;">
            📄 Docket
          </button>
        </td>
      </tr>
    `;
  }).join('');
};

// ============================================================================
// EXPORT MASTER AUDIT REGISTER TO CSV (DEAN UJJAVAL GUPTA)
// ============================================================================

window.exportAuditCsv = function() {
  if (!state.complaints || state.complaints.length === 0) {
    showToast('No records available to export.', 'info');
    return;
  }

  const headers = [
    "Complaint ID",
    "Student Name",
    "Roll Number",
    "Room Number",
    "Contact Number",
    "Category",
    "Status",
    "Assigned Warden",
    "Submitted At",
    "Resolved At",
    "Satisfaction Rating",
    "Resolution Notes"
  ];

  const csvRows = [headers.join(",")];

  for (const c of state.complaints) {
    const row = [
      escapeCsv(c.id),
      escapeCsv(c.student ? c.student.name : ''),
      escapeCsv(c.student ? c.student.studentId : ''),
      escapeCsv(c.student ? c.student.roomNumber : ''),
      escapeCsv(c.student ? c.student.contact : ''),
      escapeCsv(c.category),
      escapeCsv(c.status),
      escapeCsv(c.assignedWarden ? c.assignedWarden.name : ''),
      escapeCsv(c.submittedAt),
      escapeCsv(c.resolvedAt),
      escapeCsv(c.rating || 0),
      escapeCsv(c.resolutionNotes || '')
    ];
    csvRows.push(row.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `V-RESOLVE_Hostel_Grievance_Audit_Register_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Downloaded official Grievance Master Register (.CSV)', 'success');
};

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// ============================================================================
// EXPORT MASTER RELATIONAL SQL DATABASE DUMP (.SQL)
// ============================================================================

window.exportSqlDump = function() {
  if (!state.complaints || state.complaints.length === 0) {
    showToast('No records available to export.', 'info');
    return;
  }

  const lines = [
    "-- ===============================================================================",
    "--   V-RESOLVE: HOSTEL GRIEVANCE REDRESSAL & SLA MANAGEMENT SYSTEM",
    "--   RELATIONAL DATABASE SQL DUMP & DDL SCHEMA",
    "--   Author: Ujjaval Gupta (Reg No: 25BAI11102)",
    `--   Generated: ${new Date().toISOString()}`,
    "-- ===============================================================================",
    "",
    "CREATE TABLE IF NOT EXISTS wardens (",
    "    id VARCHAR(50) PRIMARY KEY,",
    "    name VARCHAR(100) NOT NULL,",
    "    assigned_block VARCHAR(50) NOT NULL,",
    "    contact VARCHAR(50)",
    ");",
    "",
    "CREATE TABLE IF NOT EXISTS complaints (",
    "    id VARCHAR(50) PRIMARY KEY,",
    "    student_id VARCHAR(50) NOT NULL,",
    "    student_name VARCHAR(100),",
    "    student_room VARCHAR(50),",
    "    student_contact VARCHAR(50),",
    "    category VARCHAR(50) NOT NULL,",
    "    description TEXT NOT NULL,",
    "    status VARCHAR(50) NOT NULL,",
    "    submitted_at VARCHAR(50) NOT NULL,",
    "    resolved_at VARCHAR(50),",
    "    warden_id VARCHAR(50),",
    "    warden_name VARCHAR(100),",
    "    warden_block VARCHAR(50),",
    "    escalated INTEGER DEFAULT 0,",
    "    progress_remarks TEXT,",
    "    resolution_notes TEXT,",
    "    rating INTEGER DEFAULT 0,",
    "    feedback_comment TEXT,",
    "    reopen_reason TEXT",
    ");",
    "",
    "-- Seed Appointed Block Wardens",
    "INSERT OR IGNORE INTO wardens VALUES ('W1', 'Mr. Verma', 'Block C', '+91-98765-00001');",
    "INSERT OR IGNORE INTO wardens VALUES ('W2', 'Mrs. Rao', 'Block A', '+91-98765-00002');",
    "INSERT OR IGNORE INTO wardens VALUES ('W3', 'Mr. Khan', 'Block B', '+91-98765-00003');",
    "",
    "-- Master Registered Grievances"
  ];

  for (const c of state.complaints) {
    const s = c.student || {};
    const w = c.assignedWarden || {};
    const sqlEsc = (txt) => txt ? "'" + String(txt).replace(/'/g, "''") + "'" : "NULL";

    lines.push(
      `INSERT OR REPLACE INTO complaints VALUES (` +
      `${sqlEsc(c.id)}, ` +
      `${sqlEsc(s.id || s.studentId)}, ` +
      `${sqlEsc(s.name)}, ` +
      `${sqlEsc(s.roomNumber)}, ` +
      `${sqlEsc(s.contact)}, ` +
      `${sqlEsc(c.category)}, ` +
      `${sqlEsc(c.description)}, ` +
      `${sqlEsc(c.status)}, ` +
      `${sqlEsc(c.submittedAt)}, ` +
      `${sqlEsc(c.resolvedAt)}, ` +
      `${sqlEsc(w.id)}, ` +
      `${sqlEsc(w.name)}, ` +
      `${sqlEsc(w.assignedBlock)}, ` +
      `${c.escalated ? 1 : 0}, ` +
      `${sqlEsc(c.progressRemarks)}, ` +
      `${sqlEsc(c.resolutionNotes)}, ` +
      `${c.rating || 0}, ` +
      `${sqlEsc(c.feedbackComment)}, ` +
      `${sqlEsc(c.reopenReason)}` +
      `);`
    );
  }

  const sqlContent = "data:text/sql;charset=utf-8," + encodeURIComponent(lines.join("\n"));
  const link = document.createElement("a");
  link.setAttribute("href", sqlContent);
  link.setAttribute("download", `V-RESOLVE_Hostel_Database_Dump_${new Date().toISOString().slice(0, 10)}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Downloaded official Relational SQL Database Dump (.sql)', 'success');
};

// ============================================================================
// PRINTABLE OFFICIAL GRIEVANCE DOCKET MODAL
// ============================================================================

window.generateDocketModal = function(id) {
  const c = state.complaints.find(item => item.id === id);
  if (!c) {
    showToast('Complaint record not found.', 'error');
    return;
  }

  document.getElementById('docketRefNumber').textContent = c.id;
  document.getElementById('docketStudentName').textContent = c.student ? c.student.name : 'Unknown';
  document.getElementById('docketRollNo').textContent = c.student ? c.student.studentId : '--';
  document.getElementById('docketRoom').textContent = c.student ? c.student.roomNumber : '--';
  document.getElementById('docketContact').textContent = c.student ? c.student.contact : '--';
  document.getElementById('docketCategory').textContent = c.category;
  document.getElementById('docketDate').textContent = new Date(c.submittedAt).toLocaleString();
  document.getElementById('docketWarden').textContent = c.assignedWarden ? `${c.assignedWarden.name} (${c.assignedWarden.assignedBlock})` : 'Hostel Office';
  document.getElementById('docketStatus').textContent = c.status;
  document.getElementById('docketDescription').textContent = c.description;

  const resBox = document.getElementById('docketResolutionBox');
  const resNotes = document.getElementById('docketResolutionNotes');
  if (c.resolutionNotes) {
    resNotes.textContent = c.resolutionNotes;
    resBox.style.display = 'block';
  } else {
    resBox.style.display = 'none';
  }

  document.getElementById('docketModal').classList.remove('hidden');
};

window.closeDocketModal = function() {
  document.getElementById('docketModal').classList.add('hidden');
};

// ============================================================================
// CONFIRMATION & RATING / REOPEN MODALS
// ============================================================================

window.openRateModal = function(id) {
  state.selectedComplaintIdForModal = id;
  document.getElementById('ratingComplaintIdDisplay').textContent = id;
  setStarRating(5);
  document.getElementById('feedbackCommentInput').value = '';
  openModal('rateComplaintModal');
};

window.setStarRating = function(val) {
  document.getElementById('selectedStarValue').value = val;
  const stars = document.querySelectorAll('#starPickerContainer .star-btn');
  stars.forEach((s, idx) => {
    if (idx < val) s.classList.add('active');
    else s.classList.remove('active');
  });
};

window.submitRatingFeedback = async function() {
  const id = state.selectedComplaintIdForModal;
  const rating = parseInt(document.getElementById('selectedStarValue').value, 10);
  const comment = document.getElementById('feedbackCommentInput').value.trim();

  try {
    const res = await fetch(apiUrl('api/complaints/confirm'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rating, feedback: comment })
    });
    if (res.ok) {
      showToast('Thank you! Resolution confirmed and rating recorded.', 'success');
      closeModal('rateComplaintModal');
      await loadInitialData();
      executeStudentTrackSearch();
      return;
    }
  } catch (e) {}

  const ticket = state.complaints.find(c => c.id === id);
  if (ticket) {
    ticket.status = 'CONFIRMED';
    ticket.rating = rating;
    ticket.feedbackComment = comment;
    saveLocalData();
    showToast('Thank you! Resolution confirmed.', 'success');
    closeModal('rateComplaintModal');
    executeStudentTrackSearch();
  }
};

window.openReopenModal = function(id) {
  state.selectedComplaintIdForModal = id;
  document.getElementById('reopenComplaintIdDisplay').textContent = id;
  document.getElementById('reopenReasonInput').value = '';
  openModal('reopenComplaintModal');
};

window.submitReopenComplaint = async function() {
  const id = state.selectedComplaintIdForModal;
  const reason = document.getElementById('reopenReasonInput').value.trim();

  if (!reason) {
    showToast('Please provide a reason for reopening.', 'error');
    return;
  }

  try {
    const res = await fetch(apiUrl('api/complaints/reopen'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reason })
    });
    if (res.ok) {
      showToast('Grievance reopened with escalated priority.', 'warning');
      closeModal('reopenComplaintModal');
      await loadInitialData();
      executeStudentTrackSearch();
      return;
    }
  } catch (e) {}

  const ticket = state.complaints.find(c => c.id === id);
  if (ticket) {
    ticket.status = 'REOPENED';
    ticket.reopenReason = reason;
    ticket.escalated = true;
    saveLocalData();
    showToast('Grievance reopened with escalated priority.', 'warning');
    closeModal('reopenComplaintModal');
    executeStudentTrackSearch();
  }
};

// ============================================================================
// SLA ESCALATION DAEMON MONITOR
// ============================================================================

function startSlaMonitor() {
  if (state.slaIntervalId) clearInterval(state.slaIntervalId);
  state.slaIntervalId = setInterval(() => {
    const now = Date.now();
    let escalatedCount = 0;

    state.complaints.forEach(c => {
      if (c.status !== 'RESOLVED' && c.status !== 'CONFIRMED') {
        const sub = new Date(c.submittedAt).getTime();
        if (now - sub >= 24 * 3600 * 1000 && !c.escalated) {
          c.escalated = true;
          c.status = 'ESCALATED';
          escalatedCount++;
        }
      }
    });

    if (escalatedCount > 0) {
      saveLocalData();
      if (state.currentView === 'adminSection') {
        renderAdminDashboard();
      }
    }

    // Live update any ticking SLA timer badges on screen
    const liveTimers = document.querySelectorAll('[data-sla-timer-id]');
    liveTimers.forEach(el => {
      const id = el.getAttribute('data-sla-timer-id');
      const c = state.complaints.find(x => x.id === id);
      if (c) {
        const info = getSlaTimerInfo(c);
        el.className = `timer-live-badge ${info.className}`;
        el.textContent = info.text;
      }
    });
  }, 1000);
}

// ============================================================================
// MODAL HELPERS & UTILITIES
// ============================================================================

function setupModals() {
  window.openModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  };

  window.closeModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  };
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
