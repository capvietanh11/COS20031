// ========================================
// DASHBOARD FUNCTIONALITY
// ========================================

function renderDashboard() {
    // --- Smart Summary ---
    const summary = document.querySelector('.dashboard-summary-card');
    const totalDevices = devices.length;
    const offlineDevices = devices.filter(d => d.Status === 'Off').length;
    const errorDevices = devices.filter(d => d.Status === 'Error').length;
    const todayUsage = 12.4; // kWh, mock value
    const connectionQuality = 'Good'; // mock value
    summary.innerHTML = `
        <div class="summary-title">Smart Summary</div>
        <div class="dashboard-summary-list">
            <div class="dashboard-summary-item"><span>Total Devices</span><span>${totalDevices}</span></div>
            <div class="dashboard-summary-item"><span>Offline/Error</span><span>${offlineDevices + errorDevices}</span></div>
            <div class="dashboard-summary-item"><span>Today's Usage</span><span>${todayUsage} kWh</span></div>
            <div class="dashboard-summary-item"><span>Connection Quality</span><span>${connectionQuality}</span></div>
        </div>
    `;

    // --- Line Chart (Energy Usage) ---
    const ctx = document.getElementById('energy-line-chart').getContext('2d');
    if (window.energyChart) window.energyChart.destroy();
    window.energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0h','4h','8h','12h','16h','20h','24h'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [1.2, 2.8, 3.5, 4.1, 2.9, 3.2, 2.7],
                borderColor: '#6a93cb',
                backgroundColor: 'rgba(106,147,203,0.12)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // --- Room Status Overview ---
    const roomStatusDiv = document.getElementById('room-status-chart');
    roomStatusDiv.innerHTML = '';
    const rooms = getRooms(devices);
    
    // Create a scrollable container
    const scrollContainer = document.createElement('div');
    scrollContainer.style.maxHeight = '220px';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.paddingRight = '8px';
    
    rooms.forEach(room => {
        const onCount = devices.filter(d => d.Location === room && d.Status === 'On').length;
        const offCount = devices.filter(d => d.Location === room && d.Status === 'Off').length;
        const bar = document.createElement('div');
        bar.style.marginBottom = '0.7rem';
        bar.style.display = 'flex';
        bar.style.alignItems = 'center';
        bar.style.justifyContent = 'space-between';

        // Info section
        const info = document.createElement('div');
        info.style.flex = '1';
        info.innerHTML = `
            <div style="font-weight:500;margin-bottom:0.2rem;">${room}</div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="background:#6a93cb;height:12px;width:${onCount*18+10}px;border-radius:6px;"></div>
                <span style="font-size:0.97rem;">On: ${onCount}</span>
                <div style="background:#e3eafc;height:12px;width:${offCount*18+10}px;border-radius:6px;"></div>
                <span style="font-size:0.97rem;">Off: ${offCount}</span>
            </div>
        `;
        bar.appendChild(info);

        // Detail button with unique class
        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Detail';
        detailBtn.className = 'room-detail-btn quick-action-btn';
        detailBtn.style.width = '90px';
        detailBtn.style.margin = '0 0 0 1.2rem';
        detailBtn.onclick = function() {
            // Switch to Devices tab, filter by this room
            document.getElementById('dashboard-section').style.display = 'none';
            document.getElementById('device-groups').style.display = '';
            document.querySelector('.tab-nav').style.display = '';
            document.getElementById('main-header-title').textContent = 'Devices';
            document.querySelector('.main-header-actions').style.display = '';
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            document.querySelectorAll('.sidebar-nav li')[1].classList.add('active');
            renderDeviceGroups(room, '');
            // Highlight the correct room tab
            document.querySelectorAll('#room-tabs li').forEach(tab => {
                tab.classList.toggle('active', tab.textContent === room);
            });
        };
        bar.appendChild(detailBtn);

        scrollContainer.appendChild(bar);
    });
    
    roomStatusDiv.appendChild(scrollContainer);

    // --- Quick Actions ---
    document.querySelectorAll('.dashboard-quick-actions .quick-action-btn').forEach(btn => {
        btn.onclick = function() {
            if (btn.dataset.action === 'all-on') {
                devices.forEach(d => d.Status = 'On');
            } else if (btn.dataset.action === 'all-off') {
                devices.forEach(d => d.Status = 'Off');
            } else if (btn.dataset.action === 'reset') {
                devices.forEach(d => d.Status = 'Off');
                setTimeout(() => devices.forEach(d => d.Status = 'On'), 500);
            }
            renderDashboard();
            renderDeviceGroups(currentRoom, currentSearch);
        };
    });

    // --- Recent Activity Log ---
    const logList = document.getElementById('dashboard-activity-list');
    logList.innerHTML = '';
    notifications.slice(0, 10).forEach(n => {
        const li = document.createElement('li');
        li.textContent = `[${n.SentTime}] ${n.Message}`;
        logList.appendChild(li);
    });
}

// Export for use in other modules
window.renderDashboard = renderDashboard; 