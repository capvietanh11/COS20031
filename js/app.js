// Helper: get unique rooms from devices
function getRooms(devices) {
    const rooms = new Set(devices.map(d => d.Location).filter(Boolean)); // filter(Boolean) removes null/undefined
    return Array.from(rooms).sort();
}

let currentSearch = '';
let currentRoom = 'all';
let editingDevice = null;
let currentSort = 'name-asc';

function getFilteredDevices(devices, filterRoom, searchText) {
    return devices.filter(device => {
        const inRoom = filterRoom === 'all' ? true : (device.Location === filterRoom);
        const matchesSearch = device.DeviceName.toLowerCase().includes(searchText.toLowerCase());
        return inRoom && matchesSearch;
    });
}

// Render room tabs
function renderRoomTabs(rooms) {
    const tabList = document.getElementById('room-tabs');
    tabList.innerHTML = '';
    const allTab = document.createElement('li');
    allTab.textContent = 'All Devices';
    allTab.className = 'active';
    allTab.onclick = () => renderDeviceGroups('all', currentSearch);
    tabList.appendChild(allTab);
    rooms.forEach(room => {
        const tab = document.createElement('li');
        tab.textContent = room;
        tab.onclick = () => renderDeviceGroups(room, currentSearch);
        tabList.appendChild(tab);
    });
}

// Render device groups and cards
function renderDeviceGroups(filterRoom = 'all', searchText = '') {
    currentRoom = filterRoom;
    currentSearch = searchText;
    const groupContainer = document.getElementById('device-groups');
    groupContainer.innerHTML = '';

    const deviceGroups = {};

    // Group all devices by their location
    devices.forEach(device => {
        if (!device.DeviceName.toLowerCase().includes(searchText.toLowerCase())) return;
        const location = device.Location || 'Unassigned'; // Group null/empty locations
        if (!deviceGroups[location]) {
            deviceGroups[location] = [];
        }
        deviceGroups[location].push(device);
    });

    // Apply sorting to the devices within each group
    Object.keys(deviceGroups).forEach(groupName => {
        deviceGroups[groupName].sort((a, b) => {
            switch (currentSort) {
                case 'name-asc':
                    return a.DeviceName.localeCompare(b.DeviceName);
                case 'name-desc':
                    return b.DeviceName.localeCompare(a.DeviceName);
                case 'status-on':
                    return a.Status === b.Status ? 0 : a.Status === 'On' ? -1 : 1;
                case 'status-off':
                    return a.Status === b.Status ? 0 : a.Status === 'Off' ? -1 : 1;
                default:
                    return 0;
            }
        });
    });

    // Determine which rooms to display based on the filter
    const roomsToDisplay = filterRoom === 'all' ? Object.keys(deviceGroups) : [filterRoom];

    // Define the order, with special groups last
    const specialGroups = ['Other', 'Unassigned'];
    const sortedRoomsToDisplay = [
        ...roomsToDisplay.filter(r => !specialGroups.includes(r)).sort(),
        ...roomsToDisplay.filter(r => r === 'Other'),
        ...roomsToDisplay.filter(r => r === 'Unassigned')
    ];

    // Render the device groups
    sortedRoomsToDisplay.forEach((room, index) => {
        if (!deviceGroups[room]) return;

        const devicesInRoom = deviceGroups[room];
        const groupDiv = document.createElement('div');
        groupDiv.className = 'device-group';

        // Add a separator line for special groups when all devices are shown
        if (filterRoom === 'all' && specialGroups.includes(room)) {
            // Add separator only before the first special group
            if (index > 0 && !specialGroups.includes(sortedRoomsToDisplay[index - 1])) {
                groupDiv.classList.add('special-group');
            }
        }

        const title = document.createElement('div');
        title.className = 'device-group-title';

        const titleText = document.createElement('span');
        titleText.textContent = room;
        title.appendChild(titleText);

        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        const turnAllOn = document.createElement('button');
        turnAllOn.textContent = 'All On';
        turnAllOn.onclick = () => {
            devicesInRoom.forEach(d => d.Status = 'On');
            // Notification
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `All devices in ${room} were turned on.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        };
        const turnAllOff = document.createElement('button');
        turnAllOff.textContent = 'All Off';
        turnAllOff.onclick = () => {
            devicesInRoom.forEach(d => d.Status = 'Off');
            // Notification
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `All devices in ${room} were turned off.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        };
        quickActions.appendChild(turnAllOn);
        quickActions.appendChild(turnAllOff);
        title.appendChild(quickActions);

        groupDiv.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'device-grid';
        devicesInRoom.forEach(device => {
            const card = createDeviceCard(device, filterRoom);
            grid.appendChild(card);
        });
        groupDiv.appendChild(grid);
        groupContainer.appendChild(groupDiv);
    });

    // Update tab active state
    const tabList = document.getElementById('room-tabs');
    Array.from(tabList.children).forEach(tab => {
        tab.classList.remove('active');
        if ((filterRoom === 'all' && tab.textContent === 'All Devices') || tab.textContent === filterRoom) {
            tab.classList.add('active');
        }
    });
}

function getDeviceTypeIcon(deviceType) {
    switch (deviceType) {
        case 'Light': return '💡';
        case 'Thermostat': return '🌡️';
        case 'Camera': return '📷';
        case 'Sensor': return '🛰️';
        case 'Plug': return '🔌';
        case 'Speaker': return '🔊';
        case 'TV': return '📺';
        case 'Fan': return '💨';
        case 'Door Lock': return '🔒';
        default: return '⚙️'; // Default icon
    }
}

function createDeviceCard(device, filterRoom) {
    const card = document.createElement('div');
    card.className = 'device-card';
    
    // Device name
    const name = document.createElement('div');
    name.className = 'device-name';
    name.textContent = device.DeviceName;
    card.appendChild(name);
    
    // Device Icon
    const icon = document.createElement('div');
    icon.className = 'device-icon';
    icon.textContent = getDeviceTypeIcon(device.DeviceType);
    card.appendChild(icon);

    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'device-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('title', 'Delete Device');
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${device.DeviceName}?`)) {
            // Find index and remove device
            const deviceIndex = devices.findIndex(d => d.DeviceID === device.DeviceID);
            if (deviceIndex > -1) {
                devices.splice(deviceIndex, 1);
            }
            // Generate notification
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} was deleted.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            // Re-render
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        }
    };
    card.appendChild(deleteBtn);

    // Control button with status icon
    const control = document.createElement('button');
    control.className = 'device-control';
    control.innerHTML = device.Status === 'On' ? '🟢' : '🔴';
    control.setAttribute('title', device.Status === 'On' ? 'Turn Off' : 'Turn On');
    control.onclick = (e) => {
        e.stopPropagation();
        const newStatus = device.Status === 'On' ? 'Off' : 'On';
        device.Status = newStatus;
        // Generate notification
        const now = new Date();
        notifications.unshift({
            NotificationID: notifications.length + 1,
            UserID: 1, // For demo, always user 1
            Message: `${device.DeviceName} was turned ${newStatus === 'On' ? 'on' : 'off'}.`,
            SentTime: now.toLocaleString(),
            Status: 'Unread'
        });
        renderDeviceGroups(filterRoom, currentSearch);
        renderNotificationBadge();
    };
    card.appendChild(control);
    // Card click (not button)
    card.onclick = function(e) {
        if (e.target === control) return;
        openDeviceModal(device);
    };
    return card;
}

function openDeviceModal(device) {
    editingDevice = device;
    document.getElementById('modal-device-name').value = device.DeviceName;
    document.getElementById('modal-device-type').value = device.DeviceType;
    document.getElementById('modal-device-location').value = device.Location || 'Unassigned';
    document.getElementById('modal-device-status').value = device.Status;
    document.getElementById('device-modal').style.display = 'flex';
}

function closeDeviceModal() {
    document.getElementById('device-modal').style.display = 'none';
    editingDevice = null;
}

function getUnreadNotificationCount() {
    return notifications.filter(n => n.Status === 'Unread').length;
}

function renderNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    const count = getUnreadNotificationCount();
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderNotificationPopup() {
    const popup = document.getElementById('notification-popup');
    const list = document.getElementById('notification-list');
    list.innerHTML = '';
    notifications.forEach(n => {
        const li = document.createElement('li');
        li.className = n.Status === 'Unread' ? 'unread' : '';
        li.innerHTML = `<span>${n.Message}</span><span class="notification-time">${n.SentTime}</span>`;
        list.appendChild(li);
    });
    popup.style.display = 'flex';
    // Mark all as read
    notifications.forEach(n => { n.Status = 'Read'; });
    renderNotificationBadge();
}

function closeNotificationPopup() {
    document.getElementById('notification-popup').style.display = 'none';
}

// --- Schedule Feature ---
let scheduleEvents = []; // Each event: { name, time, devices: [{deviceId, status}]

function formatTime(timeStr) {
    // "23:00" -> "11:00 PM"
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
}

function renderSchedule() {
    const container = document.getElementById('schedule-events-container');
    container.innerHTML = '';
    if (scheduleEvents.length === 0) {
        const empty = document.createElement('div');
        empty.style.color = '#888';
        empty.style.padding = '1.5rem';
        empty.textContent = 'No events yet.';
        container.appendChild(empty);
    } else {
        scheduleEvents.forEach((ev, idx) => {
            const box = document.createElement('div');
            box.className = 'schedule-event-box';
            // Event name
            const name = document.createElement('div');
            name.className = 'schedule-event-name';
            name.textContent = ev.name;
            box.appendChild(name);
            // Event time
            const time = document.createElement('div');
            time.className = 'schedule-event-time';
            time.textContent = formatTime(ev.time);
            box.appendChild(time);
            // Setting button
            const settingBtn = document.createElement('button');
            settingBtn.className = 'schedule-event-btn setting';
            settingBtn.innerHTML = '⚙️';
            settingBtn.title = 'Edit';
            settingBtn.onclick = () => {
                openEventSettingModal(idx);
            };
            box.appendChild(settingBtn);
            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'schedule-event-btn remove';
            removeBtn.innerHTML = '🗑️';
            removeBtn.title = 'Remove';
            removeBtn.onclick = () => {
                scheduleEvents.splice(idx, 1);
                renderSchedule();
            };
            box.appendChild(removeBtn);
            container.appendChild(box);
        });
    }
}

// Show schedule tab
document.getElementById('schedule-tab').onclick = function() {
    document.getElementById('device-groups').style.display = 'none';
    document.getElementById('schedule-section').style.display = '';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('analytics-section').style.display = 'none'; // <-- Add this line
    document.querySelector('.tab-nav').style.display = 'none'; // Hide room tabs
    document.getElementById('main-header-title').textContent = 'Schedule'; // Set heading
    document.querySelector('.main-header-actions').style.display = 'none'; // Hide search
    renderSchedule();
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.getElementById('schedule-tab').classList.add('active');
};

// Example for Devices tab
document.querySelectorAll('.sidebar-nav li')[1].onclick = function() {
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('device-groups').style.display = '';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('analytics-section').style.display = 'none'; // <-- Add this line
    document.querySelector('.tab-nav').style.display = ''; // Show room tabs
    document.getElementById('main-header-title').textContent = 'Devices'; // Set heading
    document.querySelector('.main-header-actions').style.display = ''; // Show search
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[1].classList.add('active');
};

// Add Event Modal logic
document.getElementById('add-event-btn').onclick = function() {
    document.getElementById('add-event-modal').style.display = 'flex';
    document.getElementById('event-name-input').value = '';
    document.getElementById('event-time-input').value = '';
    document.getElementById('save-event-btn').textContent = 'Save';
    document.getElementById('add-event-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('event-name-input').value.trim();
        const time = document.getElementById('event-time-input').value;
        if (!name || !time) return;
        scheduleEvents.push({ name, time });
        document.getElementById('add-event-modal').style.display = 'none';
        renderSchedule();
    };
};
document.getElementById('close-add-event-modal').onclick = function() {
    document.getElementById('add-event-modal').style.display = 'none';
};
document.getElementById('cancel-event-btn').onclick = function(e) {
    e.preventDefault();
    document.getElementById('add-event-modal').style.display = 'none';
};

// Hide schedule section by default on load
window.onload = (function(orig) {
    return function() {
        orig && orig();
        document.getElementById('schedule-section').style.display = 'none';
    };
})(window.onload);

// On load
window.onload = function() {
    const rooms = getRooms(devices);
    renderRoomTabs(rooms);
    renderDeviceGroups('all', '');
    // Add search event
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function(e) {
        renderDeviceGroups(currentRoom, e.target.value);
    });
    renderNotificationBadge();
    // Bell click
    document.getElementById('notification-bell').onclick = function() {
        renderNotificationPopup();
    };
    document.getElementById('close-notification-popup').onclick = function() {
        closeNotificationPopup();
    };
    // Device modal events
    document.getElementById('close-device-modal').onclick = closeDeviceModal;
    document.getElementById('cancel-device-btn').onclick = function(e) {
        e.preventDefault();
        closeDeviceModal();
    };
    document.getElementById('device-form').onsubmit = function(e) {
        e.preventDefault();
        if (!editingDevice) return;
        editingDevice.DeviceName = document.getElementById('modal-device-name').value;
        editingDevice.DeviceType = document.getElementById('modal-device-type').value;
        const locVal = document.getElementById('modal-device-location').value;
        editingDevice.Location = (locVal === 'Unassigned') ? null : locVal;
        editingDevice.Status = document.getElementById('modal-device-status').value;
        // Generate notification for device update
        const now = new Date();
        notifications.unshift({
            NotificationID: notifications.length + 1,
            UserID: 1, // For demo, always user 1
            Message: `${editingDevice.DeviceName} information was updated.`,
            SentTime: now.toLocaleString(),
            Status: 'Unread'
        });
        closeDeviceModal();
        renderRoomTabs(getRooms(devices));
        renderDeviceGroups(currentRoom, currentSearch);
        renderNotificationBadge();
    };
    const sortDropdown = document.getElementById('sort-devices-dropdown');
    sortDropdown.addEventListener('change', function(e) {
        currentSort = e.target.value;
        renderDeviceGroups(currentRoom, currentSearch);
    });
    // In sidebar-header (settings button)
    document.querySelector('.sidebar-settings').setAttribute('title', 'Settings');
};

// Show Dashboard tab
document.querySelectorAll('.sidebar-nav li')[0].onclick = function() {
    document.getElementById('device-groups').style.display = 'none';
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = '';
    document.getElementById('analytics-section').style.display = 'none'; // <-- Add this line
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Dashboard';
    document.querySelector('.main-header-actions').style.display = 'none';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[0].classList.add('active');
    renderDashboard();
};

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

        roomStatusDiv.appendChild(bar);
    });

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

// Show Analytics tab
document.querySelectorAll('.sidebar-nav li')[3].onclick = function() {
    document.getElementById('device-groups').style.display = 'none';
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('analytics-section').style.display = ''; // <-- Show only here
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Analytics';
    document.querySelector('.main-header-actions').style.display = 'none';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[3].classList.add('active');
    renderAnalyticsDashboard();
};

function renderAnalyticsDashboard() {
    // 1. Device Usage Statistics (Pie Chart)
    const deviceUsageData = [
        { name: 'Living Room Light', usage: 120 },
        { name: 'Bedroom AC', usage: 95 },
        { name: 'Kitchen Plug', usage: 80 },
        { name: 'Garage Door', usage: 60 },
        { name: 'TV', usage: 55 },
        { name: 'Other', usage: 40 }
    ];
    const pieCtx = document.getElementById('device-usage-chart').getContext('2d');
    if (window.deviceUsageChart) window.deviceUsageChart.destroy();
    window.deviceUsageChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: deviceUsageData.map(d => d.name),
            datasets: [{
                data: deviceUsageData.map(d => d.usage),
                backgroundColor: ['#6a93cb','#e3eafc','#ffd6d6','#a3e1d4','#f7b267','#b5b5b5']
            }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });
    document.getElementById('top-devices-list').innerHTML =
        '<b>Top 5 Devices:</b><br>' +
        deviceUsageData.slice(0,5).map(d => `${d.name}: ${d.usage} uses`).join('<br>');

    // 2. Sensor Data Trends (Line Chart)
    const sensorCtx = document.getElementById('sensor-trends-chart').getContext('2d');
    if (window.sensorTrendsChart) window.sensorTrendsChart.destroy();
    window.sensorTrendsChart = new Chart(sensorCtx, {
        type: 'line',
        data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
                { label: 'Temperature (°C)', data: [22,23,21,24,25,23,22], borderColor:'#f7b267', fill:false },
                { label: 'Humidity (%)', data: [55,60,58,62,59,57,56], borderColor:'#6a93cb', fill:false }
            ]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });

    // 3. Automation Rule Effectiveness (Bar Chart)
    const automationData = [
        { rule: 'Night Mode', triggered: 40, success: 38 },
        { rule: 'Away Mode', triggered: 25, success: 22 },
        { rule: 'Morning Routine', triggered: 30, success: 28 }
    ];
    const autoCtx = document.getElementById('automation-effectiveness-chart').getContext('2d');
    if (window.automationEffectivenessChart) window.automationEffectivenessChart.destroy();
    window.automationEffectivenessChart = new Chart(autoCtx, {
        type: 'bar',
        data: {
            labels: automationData.map(r => r.rule),
            datasets: [
                { label: 'Triggered', data: automationData.map(r => r.triggered), backgroundColor:'#6a93cb' },
                { label: 'Success', data: automationData.map(r => r.success), backgroundColor:'#a3e1d4' }
            ]
        },
        options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero:true } } }
    });
    document.getElementById('automation-rule-list').innerHTML =
        automationData.map(r => `${r.rule}: ${r.success}/${r.triggered} successful`).join('<br>');

    // 4. User Behavior Insights (Bar + Heatmap)
    const userBehaviorCtx = document.getElementById('user-behavior-chart').getContext('2d');
    if (window.userBehaviorChart) window.userBehaviorChart.destroy();
    window.userBehaviorChart = new Chart(userBehaviorCtx, {
        type: 'bar',
        data: {
            labels: ['Alice','Bob','Carol','Dave'],
            datasets: [{ label: 'Device Controls', data: [34,28,22,18], backgroundColor:'#f7b267' }]
        },
        options: { plugins: { legend: { display:false } }, scales: { y: { beginAtZero:true } } }
    });
    // Heatmap (simulate with stacked bar)
    const heatmapCtx = document.getElementById('user-heatmap-chart').getContext('2d');
    if (window.userHeatmapChart) window.userHeatmapChart.destroy();
    window.userHeatmapChart = new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: ['00','04','08','12','16','20'],
            datasets: [
                { label: 'Alice', data: [2,5,8,10,6,3], backgroundColor:'#6a93cb' },
                { label: 'Bob', data: [1,3,6,8,5,2], backgroundColor:'#f7b267' },
                { label: 'Carol', data: [0,2,4,7,3,1], backgroundColor:'#a3e1d4' }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } }, scales: { x: { stacked:true }, y: { stacked:true } } }
    });

    // 5. Security Access Logs (Pie + List)
    const securityCtx = document.getElementById('security-access-chart').getContext('2d');
    if (window.securityAccessChart) window.securityAccessChart.destroy();
    window.securityAccessChart = new Chart(securityCtx, {
        type: 'pie',
        data: {
            labels: ['Success','Failed'],
            datasets: [{ data: [120,8], backgroundColor:['#a3e1d4','#ffd6d6'] }]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
    document.getElementById('access-attempts-list').innerHTML =
        '<b>Access Attempts:</b><br>Alice: 60<br>Bob: 40<br>Carol: 20<br>Dave: 8';

    // 6. Device Health Trends (Line + List)
    const healthCtx = document.getElementById('device-health-chart').getContext('2d');
    if (window.deviceHealthChart) window.deviceHealthChart.destroy();
    window.deviceHealthChart = new Chart(healthCtx, {
        type: 'line',
        data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
                { label: 'Online', data: [12,12,11,12,13,12,12], borderColor:'#6a93cb', fill:false },
                { label: 'Offline', data: [1,2,2,1,0,1,1], borderColor:'#ffd6d6', fill:false }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
    document.getElementById('device-health-list').innerHTML =
        '<b>Recent Updates:</b><br>Living Room Light: Today 09:12<br>Bedroom AC: Yesterday 22:30<br>Garage Door: Today 07:45';

    // 7. Event Log Summary (Bar + List)
    const eventLogCtx = document.getElementById('event-log-chart').getContext('2d');
    if (window.eventLogChart) window.eventLogChart.destroy();
    window.eventLogChart = new Chart(eventLogCtx, {
        type: 'bar',
        data: {
            labels: ['Turn On','Turn Off','Schedule','Error','Login'],
            datasets: [{ label: 'Events', data: [40,38,22,5,8], backgroundColor:'#6a93cb' }]
        },
        options: { plugins: { legend: { display:false } }, scales: { y: { beginAtZero:true } } }
    });
    document.getElementById('event-type-list').innerHTML =
        '<b>Top Events:</b><br>Turn On: 40<br>Turn Off: 38<br>Schedule: 22<br>Error: 5<br>Login: 8';

    // 8. Schedule vs Actual Usage (Line Chart)
    const scheduleCtx = document.getElementById('schedule-vs-actual-chart').getContext('2d');
    if (window.scheduleVsActualChart) window.scheduleVsActualChart.destroy();
    window.scheduleVsActualChart = new Chart(scheduleCtx, {
        type: 'line',
        data: {
            labels: ['00','04','08','12','16','20','24'],
            datasets: [
                { label: 'Scheduled', data: [2,4,6,8,6,4,2], borderColor:'#6a93cb', fill:false },
                { label: 'Actual', data: [1,3,5,7,5,3,1], borderColor:'#f7b267', fill:false }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
}

// --- Event Setting Modal ---
function openEventSettingModal(eventIdx) {
    const event = scheduleEvents[eventIdx];
    document.getElementById('event-setting-modal').style.display = 'flex';

    // Render device list
    const list = document.getElementById('event-devices-list');
    list.innerHTML = '';
    devices.forEach(device => {
        const row = document.createElement('div');
        row.className = 'event-device-row';

        // Device label
        const label = document.createElement('label');
        label.textContent = device.DeviceName;
        row.appendChild(label);

        // Status select (On/Off/Ignore)
        const select = document.createElement('select');
        select.innerHTML = `
            <option value="">Ignore</option>
            <option value="On">On</option>
            <option value="Off">Off</option>
        `;
        // Find existing config
        let config = (event.devices || []).find(d => d.deviceId === device.DeviceID);
        select.value = config ? config.status : '';
        row.appendChild(select);

        // If device supports level (e.g., Light, Speaker), show range input
        let supportsLevel = ['Light', 'Speaker', 'Fan'].includes(device.DeviceType);
        let range;
        if (supportsLevel) {
            range = document.createElement('input');
            range.type = 'range';
            range.min = 0;
            range.max = 100;
            range.value = config && config.level !== undefined ? config.level : 100;
            range.style.marginLeft = '1rem';
            row.appendChild(range);
        }

        // Save changes on select/range change
        select.onchange = function() {
            if (!event.devices) event.devices = [];
            let idx = event.devices.findIndex(d => d.deviceId === device.DeviceID);
            if (this.value) {
                if (idx >= 0) {
                    event.devices[idx].status = this.value;
                } else {
                    let newConfig = { deviceId: device.DeviceID, status: this.value };
                    if (supportsLevel) newConfig.level = range.value;
                    event.devices.push(newConfig);
                }
            } else if (idx >= 0) {
                event.devices.splice(idx, 1);
            }
        };
        if (supportsLevel) {
            range.oninput = function() {
                if (!event.devices) event.devices = [];
                let idx = event.devices.findIndex(d => d.deviceId === device.DeviceID);
                if (select.value) {
                    if (idx >= 0) {
                        event.devices[idx].level = parseInt(range.value, 10);
                    } else {
                        event.devices.push({ deviceId: device.DeviceID, status: select.value, level: parseInt(range.value, 10) });
                    }
                }
            };
        }

        list.appendChild(row);
    });

    // Save/cancel/close handlers
    document.getElementById('event-setting-form').onsubmit = function(e) {
        e.preventDefault();
        document.getElementById('event-setting-modal').style.display = 'none';
    };
    document.getElementById('save-event-setting-btn').onclick = function() {
        document.getElementById('event-setting-modal').style.display = 'none';
    };
    document.getElementById('close-event-setting-modal').onclick = function() {
        document.getElementById('event-setting-modal').style.display = 'none';
    };
    document.getElementById('cancel-event-setting-btn').onclick = function(e) {
        e.preventDefault();
        document.getElementById('event-setting-modal').style.display = 'none';
    };
}
