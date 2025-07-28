// ========================================
// DEVICE CARD CREATION AND RENDERING
// ========================================

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

    // --- Sensor Data Button for Camera/Sensor/Detecting Devices ---
    const sensorTypes = ['Camera', 'Sensor'];
    if (sensorTypes.includes(device.DeviceType)) {
        const showSensorBtn = document.createElement('button');
        showSensorBtn.className = 'show-sensor-btn';
        showSensorBtn.textContent = 'Show Sensor Data';
        showSensorBtn.onclick = (e) => {
            e.stopPropagation();
            showSensorDataModal(device.DeviceID);
        };
        card.appendChild(showSensorBtn);
    }

    // Device-specific controls
    if (device.DeviceType === 'Light') {
        createLightControls(device, card, filterRoom);
    } else if (device.DeviceType === 'Thermostat' || device.DeviceType === 'Air Conditioner') {
        createTemperatureControls(device, card, filterRoom);
    } else if (device.DeviceType === 'Fan') {
        createFanControls(device, card);
    } else if (device.DeviceType === 'Speaker') {
        createSpeakerControls(device, card);
    } else if (device.DeviceType === 'TV') {
        createTVControls(device, card);
    } else if (device.DeviceType === 'Door Lock') {
        createDoorLockControls(device, card);
    } else if (device.DeviceType === 'Curtain') {
        createCurtainControls(device, card);
    } else if (device.DeviceType === 'Plug') {
        createPlugControls(device, card);
    } else if (device.DeviceType === 'Air Purifier') {
        createAirPurifierControls(device, card);
    }

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

// Export for use in other modules
window.createDeviceCard = createDeviceCard;
window.renderRoomTabs = renderRoomTabs;
window.renderDeviceGroups = renderDeviceGroups; 