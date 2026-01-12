/* 
  HealthSync - Master Application Logic 
  Connected to Real Backend (MongoDB)
*/

/* ==========================================================================
   1. AUTHENTICATION SERVICE
   ========================================================================== */
const AuthService = {
    login: async (email, password, role) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();

                // Strict Role Check
                if (user.role !== role) {
                    return { success: false, message: `Access Denied. You are not registered as a ${role}.` };
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, role: user.role, redirect: `dashboard-${user.role}.html` };
            } else {
                return { success: false, message: 'Invalid Credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server Connection Failed. Please ensure the backend is running.' };
        }
    },
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    checkAuth: () => {
        if (!localStorage.getItem('currentUser')) {
            window.location.href = 'login.html';
        }
    }
};

/* ==========================================================================
   2. DATA SERVICES (API CALLS)
   ========================================================================== */
const API_BASE = 'http://localhost:8080/api';

const DataService = {
    getAppointments: async (role, userId) => {
        try {
            // Fetch based on role
            const endpoint = role === 'patient'
                ? `/appointments/patient/${userId}`
                : `/appointments/doctor/${userId}`;

            const response = await fetch(`${API_BASE}${endpoint}`);
            if (response.ok) return await response.json();
            return [];
        } catch (e) {
            console.error("Failed to fetch appointments", e);
            return [];
        }
    },
    updateAppointmentStatus: async (apptId, status, message) => {
        try {
            const response = await fetch(`${API_BASE}/appointments/${apptId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, message })
            });
            return response.ok;
        } catch (e) {
            console.error("Failed to update status", e);
            return false;
        }
    },
    getHospitals: async () => {
        try {
            const response = await fetch(`${API_BASE}/hospitals`);
            if (response.ok) return await response.json();
            return [];
        } catch (e) {
            console.error("Failed to fetch hospitals", e);
            return [];
        }
    },
    bookAppointment: async (appointmentData) => {
        try {
            const response = await fetch(`${API_BASE}/appointments/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });
            return response.ok;
        } catch (e) {
            console.error("Booking failed", e);
            return false;
        }
    }
};

/* ==========================================================================
   3. UI RENDERING (Landing Page & Dashboards)
   ========================================================================== */

// --- Landing Page Logic ---
async function initLandingPage() {
    const hospitalList = document.getElementById('hospitalList');
    const bedGrid = document.getElementById('bedGrid');
    const paginationControls = document.getElementById('paginationControls');

    // Search Input Logic
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Load initial data
    let allHospitals = await DataService.getHospitals();

    async function performSearch() {
        const query = searchInput.value.toLowerCase();

        // Let's use Server Search if query exists, else all
        if (query.length > 0) {
            try {
                const res = await fetch(`${API_BASE}/hospitals/search?query=${query}`);
                allHospitals = await res.json();
            } catch (e) { console.error(e); }
        } else {
            allHospitals = await DataService.getHospitals();
        }

        renderHospitals(allHospitals);

        if (paginationControls) paginationControls.innerHTML = '';
        if (allHospitals.length === 0) {
            hospitalList.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 40px; color: #666;"><h3>No hospitals found matching your search.</h3></div>';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    if (searchBtn) {
        searchBtn.onclick = performSearch;
    }

    if (hospitalList) {
        let showAll = false;
        const initialCount = 8;

        function updateView() {
            const displayData = showAll ? allHospitals : allHospitals.slice(0, initialCount);
            renderHospitals(displayData);

            if (paginationControls) {
                if (!showAll && allHospitals.length > initialCount) {
                    paginationControls.innerHTML = `
                        <button id="viewMoreBtn" class="btn btn-outline">
                            View All Hospitals (${allHospitals.length}) <i class="fa-solid fa-arrow-down"></i>
                        </button>
                    `;
                    document.getElementById('viewMoreBtn').onclick = () => {
                        showAll = true;
                        updateView();
                    };
                } else {
                    paginationControls.innerHTML = '';
                    if (showAll) {
                        paginationControls.innerHTML = `
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                Showing all ${allHospitals.length} hospitals
                            </div>
                        `;
                    }
                }
            }
        }
        updateView();
    }

    if (bedGrid) renderBeds(allHospitals);

    // Auth Button State
    const user = AuthService.getCurrentUser();
    if (user) {
        const loginBtn = document.querySelector('a[href="login.html"]');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fa-solid fa-user-circle"></i> Go to Dashboard`;
            loginBtn.href = `dashboard-${user.role}.html`;
            loginBtn.classList.add('btn-primary');
            loginBtn.classList.remove('btn-outline');
        }
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'book') {
        openBookingModal();
    }
}

function renderHospitals(data) {
    const list = document.getElementById('hospitalList');
    if (!list) return;

    list.innerHTML = data.map(h => `
        <div class="hospital-card">
            <div class="card-img">
                 <img src="${h.image || 'assets/images/hospital_1.png'}" alt="${h.name}" 
                 onerror="this.src='https://placehold.co/600x400/e2e8f0/1e293b?text=Hospital'">
                 <div class="card-rating"><i class="fa-solid fa-star" style="color: #fcc419;"></i> ${h.rating}</div>
            </div>
            <div class="card-body">
                <h3>${h.name}</h3>
                <p style="color: #666;"><i class="fa-solid fa-location-dot"></i> ${h.location}</p>
                <div class="mb-3">${(h.departments || []).map(d => `<span class="tag">${d}</span>`).join('')}</div>
                <button onclick="openBookingModal('${h.name}')" class="btn btn-outline" style="width: 100%;">Book Appointment</button>
            </div>
        </div>
    `).join('');
}

// --- Booking Logic ---
let selectedHospital = '';

async function openBookingModal(hospitalName) {
    if (!AuthService.getCurrentUser()) {
        window.location.href = 'login.html?returnUrl=index.html&action=book';
        return;
    }

    const modal = document.getElementById('bookingModal');
    const select = document.getElementById('hospitalSelect');

    // Populate Select if empty
    if (select.children.length === 0) {
        const hospitals = await DataService.getHospitals();
        select.innerHTML = hospitals.map(h => `<option>${h.name}</option>`).join('');
    }

    // Set Selection
    if (hospitalName) {
        select.value = hospitalName;
    }

    // Pre-fill Patient Name if logged in
    const user = AuthService.getCurrentUser();
    if (user) {
        const nameInput = modal.querySelector('input[placeholder="Full Name"]');
        if (nameInput) {
            nameInput.value = user.name;
            nameInput.readOnly = true;
            nameInput.style.backgroundColor = '#f3f4f6';
        }
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

async function handleBooking(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    const user = AuthService.getCurrentUser();
    if (!user) return;

    // Form Data
    const date = e.target.querySelector('input[type="date"]').value;
    const timeSelect = e.target.querySelector('select:not(#hospitalSelect)');
    const time = timeSelect ? timeSelect.value : '10:00 AM';

    // Logic to select doctor needed (random doctor for MVP or specific if enhanced)
    // For now we just create a booking with null doctorId and let the backend/admin handle it
    // Or we could pick a doctor from the hospital if we had that data handy in the select

    const appointmentData = {
        patientId: user.id,
        doctorId: null,
        date: date,
        time: time,
        type: "Consultation",
        status: "Pending"
    };

    // 1. Simulate Availability Check UI
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Booking...';
    btn.disabled = true;

    // 2. Call API
    const success = await DataService.bookAppointment(appointmentData);

    if (success) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Slot Confirmed!';
        btn.classList.add('btn-success');

        setTimeout(() => {
            alert(`✅ Appointment Confirmed!\n\nDate: ${date}\nTime: ${time}\nStatus: Confirmed`);
            closeModal();

            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('btn-success');
            e.target.reset();
        }, 1000);
    } else {
        btn.innerHTML = 'Failed. Try Again.';
        btn.disabled = false;
        setTimeout(() => btn.innerHTML = originalText, 2000);
    }
}

function renderBeds(data) {
    const grid = document.getElementById('bedGrid');
    if (!grid) return;

    grid.innerHTML = data.slice(0, 3).map(h => `
        <div class="hospital-card" style="padding: 24px; border: 1px solid rgba(0,0,0,0.05);">
            <h4 style="margin-bottom: 20px; font-size: 1.1rem; color: var(--dark);">${h.name}</h4>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                <span style="color: var(--text-secondary); font-weight: 500;">General Beds</span>
                <span style="font-weight: 700; color: ${h.availableBeds > 0 ? 'var(--primary)' : 'var(--text-secondary)'}; font-size: 1.1rem;">
                    ${h.availableBeds} Available
                </span>
            </div>
            
            <div style="border-top: 1px solid rgba(0,0,0,0.08); margin-bottom: 16px;"></div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; background: rgba(34, 139, 230, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary);">
                    <i class="fa-solid fa-bed-pulse" style="font-size: 0.9rem;"></i>
                </div>
                <span style="font-weight: 600; color: var(--text-primary);">${h.icuBeds} ICU Beds</span>
            </div>
        </div>
    `).join('');
}


// --- Dashboard Logic ---
function initDashboard() {
    AuthService.checkAuth();
    const user = AuthService.getCurrentUser();

    // Generic Name Update
    const nameEls = document.querySelectorAll('#user-name');
    nameEls.forEach(el => el.textContent = user.name);

    // Generic Profile Image Update
    const imgEls = document.querySelectorAll('.sidebar img, .navbar img');
    imgEls.forEach(img => {
        if (user.image && !img.src.includes('logo')) {
            img.src = user.image;
        }
    });

    // Patient Specifics
    if (user.role === 'patient') {
        const idEl = document.getElementById('patient-id');
        if (idEl) idEl.textContent = `Patient ID: #${user.id.substring(user.id.length - 6)}`;
    }

    // Doctor Specifics
    if (user.role === 'doctor') {
        const deptEl = document.getElementById('doctor-dept');
        if (deptEl) deptEl.textContent = user.specialty || 'General';

        const sidebarName = document.querySelector('.sidebar .fw-bold');
        if (sidebarName) sidebarName.textContent = user.name;
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = AuthService.logout;
}

async function renderAppointmentsTable(containerId, role) {
    const user = AuthService.getCurrentUser();
    const data = await DataService.getAppointments(role, user.id);
    const container = document.getElementById(containerId);

    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = '<p class="text-muted">No appointments found.</p>';
        return;
    }

    container.innerHTML = data.map(appt => `
        <div class="card mb-3 p-3">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <h5 class="mb-1">${role === 'patient' ? ('Dr. ' + (appt.doctorId || 'Unknown')) : (appt.patientId || 'Patient')}</h5>
                    <p class="mb-0 text-muted small"><i class="fa-regular fa-clock"></i> ${appt.date} • ${appt.time}</p>
                    ${appt.status === 'Cancelled' && appt.message ? `<p class="mb-0 text-danger small"><i class="fa-solid fa-circle-info"></i> ${appt.message}</p>` : ''}
                </div>
                 <span class="badge ${appt.status === 'Confirmed' ? 'bg-success' : (appt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark')}">${appt.status}</span>
            </div>
            ${role === 'doctor' && appt.status === 'Pending' ? `
                <div class="mt-3 text-end border-top pt-2">
                    <button onclick="updateStatus('${appt.id}', 'Confirmed')" class="btn btn-sm btn-success">Confirm</button>
                    <button onclick="updateStatus('${appt.id}', 'Cancelled')" class="btn btn-sm btn-danger">Cancel</button>
                </div>
            ` : ''}
            ${role === 'patient' && appt.status !== 'Cancelled' ? `
                <div class="mt-3 text-end border-top pt-2">
                    <button onclick="cancelPatientAppt('${appt.id}')" class="btn btn-sm btn-outline-danger">Cancel</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function updateStatus(id, status) {
    let message = null;
    if (status === 'Cancelled') {
        message = "Sorry, doctor was not available on this time.";
    }
    await DataService.updateAppointmentStatus(id, status, message);
    await renderAppointmentsTable('appointments-list', 'doctor');
}

async function cancelPatientAppt(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        await DataService.updateAppointmentStatus(id, 'Cancelled', 'Cancelled by Patient');
        await renderAppointmentsTable('appointments-list', 'patient');
        showNotification('Appointment Cancelled Successfully');
    }
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.className = 'alert alert-info fixed-top m-3';
    n.style.zIndex = '9999';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hospitalList')) {
        initLandingPage();
    }
    if (document.querySelector('.sidebar')) {
        initDashboard();
    }
});
