// This is the address of our Node.js backend server
const API_BASE = 'https://project-eclecktika-backend.onrender.com/api';
const ADMIN_KEY = 'Eclectika2026AdminSecretKey'; // Matches the secret key in our backend .env

// UI Element References
const tableBody = document.getElementById("user-table-body");
const searchInput = document.getElementById("search-input");
const scanResultBox = document.getElementById("scan-result");
const photoModGrid = document.getElementById("photo-mod-grid");
const livePhotosGrid = document.getElementById("live-photos-grid");
const feedbackList = document.getElementById("feedback-list");

let html5QrcodeScanner = null;
let searchQuery = "";

// ==========================================
// 🔒 LOCK SCREEN SECURITY CONTROLLER (Suggestion 1)
// ==========================================
function checkLockScreen() {
    if (sessionStorage.getItem("admin_unlocked") === "true") {
        document.getElementById("admin-lock-screen").style.display = "none";
        // Run initial data loads only if unlocked
        triggerDashboardLoads();
    }
}

function unlockDashboard(event) {
    event.preventDefault();
    const passcode = document.getElementById("admin-passcode-input").value;
    const errorMsg = document.getElementById("lock-error-msg");
    
    if (passcode === "Sand@123") {
        sessionStorage.setItem("admin_unlocked", "true");
        document.getElementById("admin-lock-screen").style.display = "none";
        triggerDashboardLoads();
    } else {
        errorMsg.textContent = "❌ Invalid Admin Passcode! Access Denied.";
        errorMsg.style.display = "block";
        playBeep(100);
    }
}

function triggerDashboardLoads() {
    loadRegistry();
    loadPendingPhotos();
    loadLivePhotos();
    loadFeedbacks();
}

// ==========================================
// 📊 1. FETCH & RENDER ATTENDEE REGISTRY
// ==========================================
async function loadRegistry() {
    try {
        const res = await fetch(`${API_BASE}/admin/users?search=${encodeURIComponent(searchQuery)}`, {
            headers: { 'x-admin-key': ADMIN_KEY }
        });
        const data = await res.json();
        if (data.success) {
            renderTable(data.list);
        }
    } catch (e) {
        console.error("Error loading attendee list:", e);
    }
}

function renderTable(list) {
    tableBody.innerHTML = "";
    
    // Dynamic KPI calculations (Suggestion 2)
    document.getElementById("stat-users").textContent = list.length;
    let totalPasses = 0;
    let totalCheckins = 0;

    list.forEach(item => {
        totalPasses += item.registrations.length;
        totalCheckins += item.registrations.filter(r => r.verified).length;
    });

    document.getElementById("stat-passes").textContent = totalPasses;
    document.getElementById("stat-checkins").textContent = totalCheckins;

    if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888; padding: 20px;">No matching participants found.</td></tr>`;
        return;
    }

    list.forEach(item => {
        const user = item.user;
        const regs = item.registrations;

        let eventsHTML = `<span style="font-style:italic; color:#666;">No Events Registered</span>`;
        if (regs.length > 0) {
            eventsHTML = regs.map(reg => `
                <div style="margin-bottom: 8px;">
                    <strong style="color:#00c6ff;">${reg.eventName}</strong> 
                    <span class="badge ${reg.verified ? 'badge-admitted' : 'badge-pending'}">
                        ${reg.verified ? '✓ Admitted' : '⌛ Pending'}
                    </span>
                    <br><code style="font-size:0.75rem; color:#888;">ID: ${reg.ticketId}</code>
                </div>
            `).join("");
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <strong>${user.name}</strong><br>
                <span style="font-size:0.8rem; color:#888;">✉️ ${user.email} | 📞 ${user.phone || 'No phone'}</span>
            </td>
            <td>${eventsHTML}</td>
            <td>
                ${regs.length > 0 ? 
                    `<button class="nav-signin-btn" style="padding: 6px 12px; font-size:0.8rem;" onclick="focusScanner()">Scan Pass</button>` : 
                    `<span style="color:#555;">-</span>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });
}

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        loadRegistry();
    });
}

function focusScanner() {
    document.getElementById("reader").scrollIntoView({ behavior: "smooth" });
    startScanner();
}

// ==========================================
// 📷 2. WEBCAM QR SCANNER SETUP
// ==========================================
function startScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
    }
    html5QrcodeScanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
    });
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

async function onScanSuccess(decodedText, decodedResult) {
    scanResultBox.style.display = "block";
    try {
        const response = await fetch(`${API_BASE}/admin/verify-ticket`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-admin-key': ADMIN_KEY
            },
            body: JSON.stringify({ ticketId: decodedText })
        });
        const resData = await response.json();

        if (resData.status === "success") {
            scanResultBox.style.background = "rgba(0, 255, 128, 0.15)";
            scanResultBox.style.border = "1px solid #00ff80";
            scanResultBox.style.color = "#00ff80";
            scanResultBox.innerHTML = `✅ ACCESS GRANTED!<br>Attendee: <strong>${resData.attendee.name}</strong> has been checked in.`;
            playBeep(450);
            loadRegistry(); // Refresh stats and registry list
        } else if (resData.status === "already") {
            scanResultBox.style.background = "rgba(255, 170, 0, 0.15)";
            scanResultBox.style.border = "1px solid #ffaa00";
            scanResultBox.style.color = "#ffaa00";
            scanResultBox.innerHTML = `⚠️ ALREADY ADMITTED!<br>${resData.attendee.name} has already scanned this ticket.`;
            playBeep(150);
        } else {
            scanResultBox.style.background = "rgba(255, 75, 75, 0.15)";
            scanResultBox.style.border = "1px solid #ff4b4b";
            scanResultBox.style.color = "#ff4b4b";
            scanResultBox.innerHTML = `❌ INVALID TICKET CODE!<br>No match found in Database.`;
            playBeep(50);
        }
    } catch (e) {
        console.error("Verification error:", e);
    }
}

function onScanFailure(error) {}

function playBeep(frequency) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 150);
    } catch(e) {}
}

// ==========================================
// 📸 3. GALLERY CONTRIBUTION MODERATION
// ==========================================
async function loadPendingPhotos() {
    try {
        const res = await fetch(`${API_BASE}/admin/pending-photos`, {
            headers: { 'x-admin-key': ADMIN_KEY }
        });
        const data = await res.json();
        if (data.success) {
            renderPhotos(data.pending);
        }
    } catch (e) {
        console.error("Error loading pending images:", e);
    }
}

function renderPhotos(photos) {
    photoModGrid.innerHTML = "";
    if (photos.length === 0) {
        photoModGrid.innerHTML = `<div style="grid-column: 1/-1; color:#888; font-style:italic;">No pending photo uploads to review.</div>`;
        return;
    }
    photos.forEach(photo => {
        const card = document.createElement("div");
        card.className = "mod-card";
        card.innerHTML = `
            <img src="${photo.imageUrl}" alt="Upload">
            <div style="font-size:0.75rem; padding: 4px; color:#aaa;">By: ${photo.userName}</div>
            <div class="mod-actions">
                <button class="mod-btn btn-approve" data-id="${photo._id}">Approve</button>
                <button class="mod-btn btn-reject" data-id="${photo._id}">Reject</button>
            </div>
        `;
        card.querySelector(".btn-approve").addEventListener("click", () => moderatePhoto(photo._id, 'approved'));
        card.querySelector(".btn-reject").addEventListener("click", () => moderatePhoto(photo._id, 'rejected'));
        photoModGrid.appendChild(card);
    });
}

// ==========================================
// 📸 3.5 LOAD & MANAGE APPROVED LIVE MOMENTS (UNDO FEATURE)
// ==========================================
async function loadLivePhotos() {
    try {
        const res = await fetch(`${API_BASE}/gallery/live`);
        const data = await res.json();
        if (data.success) {
            renderLivePhotos(data.photos);
        }
    } catch (e) {
        console.error("Error loading live gallery photos:", e);
    }
}

function renderLivePhotos(photos) {
    livePhotosGrid.innerHTML = "";
    if (photos.length === 0) {
        livePhotosGrid.innerHTML = `<div style="grid-column: 1/-1; color:#888; font-style:italic;">No live moments in the gallery.</div>`;
        return;
    }
    photos.forEach(photo => {
        const card = document.createElement("div");
        card.className = "mod-card";
        card.innerHTML = `
            <img src="${photo.imageUrl}" alt="Live">
            <div style="font-size:0.75rem; padding: 4px; color:#aaa;">By: ${photo.userName}</div>
            <div class="mod-actions">
                <button class="mod-btn btn-reject" style="background: rgba(255, 75, 75, 0.3);" data-id="${photo._id}">Remove</button>
            </div>
        `;
        card.querySelector(".btn-reject").addEventListener("click", () => moderatePhoto(photo._id, 'rejected'));
        livePhotosGrid.appendChild(card);
    });
}

async function moderatePhoto(photoId, action) {
    try {
        const res = await fetch(`${API_BASE}/admin/moderate-photo`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-admin-key': ADMIN_KEY
            },
            body: JSON.stringify({ photoId, action })
        });
        const data = await res.json();
        if (data.success) {
            loadPendingPhotos();
            loadLivePhotos();
            if (action === 'approved') {
                alert("Photo approved! It is now live in the gallery.");
            } else {
                alert("Photo removed from the gallery successfully.");
            }
        }
    } catch(e) { alert("Action failed."); }
}

// ==========================================
// 💬 4. FETCH & RENDER FEST FEEDBACKS
// ==========================================
async function loadFeedbacks() {
    try {
        const res = await fetch(`${API_BASE}/admin/feedbacks`, {
            headers: { 'x-admin-key': ADMIN_KEY }
        });
        const data = await res.json();
        if (data.success) {
            renderFeedbacks(data.feedbacks);
        }
    } catch (e) {
        console.error("Error loading feedbacks:", e);
    }
}

function renderFeedbacks(feedbacks) {
    feedbackList.innerHTML = "";
    
    // Dynamic KPI feedback calculation (Suggestion 2)
    document.getElementById("stat-reviews").textContent = feedbacks.length;

    if (feedbacks.length === 0) {
        feedbackList.innerHTML = `<div style="color:#888; font-style:italic;">No feedbacks submitted yet.</div>`;
        return;
    }
    feedbacks.forEach(fb => {
        const starsHTML = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
        const card = document.createElement("div");
        card.style.background = "rgba(255, 255, 255, 0.03)";
        card.style.border = "1px solid rgba(255, 255, 255, 0.08)";
        card.style.borderRadius = "8px";
        card.style.padding = "12px 15px";
        card.style.marginBottom = "10px";
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                <strong>${fb.userName}</strong>
                <span style="color:#ffaa00; font-size:1.1rem; letter-spacing:2px;">${starsHTML}</span>
            </div>
            <p style="color:#cbd5e1; font-size:0.9rem; margin:0;">"${fb.message}"</p>
            <div style="font-size:0.75rem; color:#666; margin-top:6px; text-align:right;">Submitted at: ${new Date(fb.createdAt).toLocaleTimeString()}</div>
        `;
        feedbackList.appendChild(card);
    });
}

// Check lock screen status on page boot
checkLockScreen();