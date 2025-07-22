// Helper: get unique rooms from devices
function getRooms(devices) {
    const rooms = new Set(devices.map(d => d.Location).filter(Boolean)); // filter(Boolean) removes null/undefined
    return Array.from(rooms).sort();
}

let currentSearch = '';
let currentRoom = 'all';
let editingDevice = null;

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
        title.textContent = room;
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

function createDeviceCard(device, filterRoom) {
    const card = document.createElement('div');
    card.className = 'device-card';
    // Device name
    const name = document.createElement('div');
    name.className = 'device-name';
    name.textContent = device.DeviceName;
    card.appendChild(name);
    // Control button with status icon
    const control = document.createElement('button');
    control.className = 'device-control';
    control.innerHTML = device.Status === 'On' ? '🟢' : '🔴';
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
        closeDeviceModal();
        renderRoomTabs(getRooms(devices));
        renderDeviceGroups(currentRoom, currentSearch);
    };
};
