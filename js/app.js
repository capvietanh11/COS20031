// Helper: get unique rooms from devices
function getRooms(devices) {
    const rooms = new Set(devices.map(d => d.Location).filter(Boolean)); // filter(Boolean) removes null/undefined
    return Array.from(rooms).sort();
}

let currentSearch = '';
let currentRoom = 'all';
let editingDevice = null;
let currentSort = 'name-asc';
let currentGroupBy = 'room';

function getFilteredDevices(devices, filterRoom, searchText) {
    return devices.filter(device => {
        const inRoom = filterRoom === 'all' ? true : (device.Location === filterRoom);
        const matchesSearch = device.DeviceName.toLowerCase().includes(searchText.toLowerCase());
        return inRoom && matchesSearch;
    });
}

// Helper to get unique device types
function getDeviceTypes(devices) {
    return Array.from(new Set(devices.map(d => d.DeviceType)));
}

// Helper to get recent event for a device
function getRecentEvent(deviceID) {
    const events = eventLogs.filter(e => e.RelatedDeviceID === deviceID);
    if (events.length === 0) return null;
    events.sort((a, b) => new Date(b.CreateAt) - new Date(a.CreateAt));
    return events[0];
}

let selectedDevices = new Set();

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

    let deviceGroups = {};
    let groupKeys = [];

    // Enhanced search: match name, type, or location
    const filteredDevices = devices.filter(device => {
        const search = searchText.toLowerCase();
        return (
            device.DeviceName.toLowerCase().includes(search) ||
            device.DeviceType.toLowerCase().includes(search) ||
            (device.Location && device.Location.toLowerCase().includes(search))
        ) && (filterRoom === 'all' || device.Location === filterRoom);
    });

    if (currentGroupBy === 'room') {
        filteredDevices.forEach(device => {
            const location = device.Location || 'Unassigned';
            if (!deviceGroups[location]) deviceGroups[location] = [];
            deviceGroups[location].push(device);
        });
        groupKeys = Object.keys(deviceGroups).sort();
    } else {
        filteredDevices.forEach(device => {
            const type = device.DeviceType;
            if (!deviceGroups[type]) deviceGroups[type] = [];
            deviceGroups[type].push(device);
        });
        groupKeys = getDeviceTypes(filteredDevices).sort();
    }

    // Bulk action bar
    renderBulkActionBar();

    groupKeys.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'device-group';
        const title = document.createElement('div');
        title.className = 'device-group-title';
        title.textContent = group;
        groupDiv.appendChild(title);
        const grid = document.createElement('div');
        grid.className = 'device-grid';
        deviceGroups[group].forEach(device => {
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
    // Checkbox for bulk actions
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'device-select-checkbox';
    checkbox.checked = selectedDevices.has(device.DeviceID);
    checkbox.onclick = (e) => {
        e.stopPropagation();
        if (checkbox.checked) {
            selectedDevices.add(device.DeviceID);
        } else {
            selectedDevices.delete(device.DeviceID);
        }
        renderBulkActionBar();
    };
    card.appendChild(checkbox);
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
    // Recent event
    const recentEvent = getRecentEvent(device.DeviceID);
    if (recentEvent) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'device-recent-event';
        eventDiv.textContent = `${recentEvent.EventType}: ${recentEvent.Description}`;
        card.appendChild(eventDiv);
    }
    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'device-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('title', 'Delete Device');
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${device.DeviceName}?`)) {
            const deviceIndex = devices.findIndex(d => d.DeviceID === device.DeviceID);
            if (deviceIndex > -1) {
                devices.splice(deviceIndex, 1);
            }
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} was deleted.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        }
    };
    card.appendChild(deleteBtn);
    // Control button
    const control = document.createElement('button');
    control.className = 'device-control';
    control.innerHTML = device.Status === 'On' ? '🟢' : '🔴';
    control.setAttribute('title', device.Status === 'On' ? 'Turn Off' : 'Turn On');
    control.onclick = (e) => {
        e.stopPropagation();
        const newStatus = device.Status === 'On' ? 'Off' : 'On';
        device.Status = newStatus;
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
        if (e.target === control || e.target === deleteBtn || e.target === checkbox) return;
        openDeviceModal(device);
    };
    return card;
}

function renderBulkActionBar() {
    let bar = document.getElementById('bulk-action-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'bulk-action-bar';
        bar.className = 'bulk-action-bar';
        document.body.appendChild(bar);
    }
    if (selectedDevices.size === 0) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = `<span>${selectedDevices.size} selected</span>`;
    const turnOnBtn = document.createElement('button');
    turnOnBtn.textContent = 'Turn On';
    turnOnBtn.onclick = () => {
        devices.forEach(d => { if (selectedDevices.has(d.DeviceID)) d.Status = 'On'; });
        renderDeviceGroups(currentRoom, currentSearch);
    };
    const turnOffBtn = document.createElement('button');
    turnOffBtn.textContent = 'Turn Off';
    turnOffBtn.onclick = () => {
        devices.forEach(d => { if (selectedDevices.has(d.DeviceID)) d.Status = 'Off'; });
        renderDeviceGroups(currentRoom, currentSearch);
    };
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        if (confirm('Delete selected devices?')) {
            for (const id of selectedDevices) {
                const idx = devices.findIndex(d => d.DeviceID === id);
                if (idx > -1) devices.splice(idx, 1);
            }
            selectedDevices.clear();
            renderDeviceGroups(currentRoom, currentSearch);
        }
    };
    bar.appendChild(turnOnBtn);
    bar.appendChild(turnOffBtn);
    bar.appendChild(deleteBtn);
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
    const groupByDropdown = document.getElementById('group-by-dropdown');
    groupByDropdown.addEventListener('change', function(e) {
        currentGroupBy = e.target.value;
        renderDeviceGroups(currentRoom, currentSearch);
    });
    // In sidebar-header (settings button)
    document.querySelector('.sidebar-settings').setAttribute('title', 'Settings');
};
