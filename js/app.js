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

    // Light controls
    if (device.DeviceType === 'Light') {
        // Brightness slider
        const brightControl = document.createElement('div');
        brightControl.className = 'light-brightness-control';
        const brightLabel = document.createElement('span');
        brightLabel.textContent = 'Brightness:';
        const brightSlider = document.createElement('input');
        brightSlider.type = 'range';
        brightSlider.min = 0;
        brightSlider.max = 100;
        brightSlider.value = device.Brightness;
        brightSlider.className = 'light-brightness-slider';
        brightSlider.oninput = (e) => {
            device.Brightness = parseInt(e.target.value);
            brightValue.textContent = device.Brightness + '%';
        };
        brightSlider.onchange = (e) => {
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} brightness set to ${device.Brightness}%.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderNotificationBadge();
        };
        const brightValue = document.createElement('span');
        brightValue.className = 'light-brightness-value';
        brightValue.textContent = device.Brightness + '%';
        brightControl.appendChild(brightLabel);
        brightControl.appendChild(brightSlider);
        brightControl.appendChild(brightValue);
        card.appendChild(brightControl);
        // Color swatch and picker
        const colorControl = document.createElement('div');
        colorControl.className = 'light-color-control';
        const colorLabel = document.createElement('span');
        colorLabel.textContent = 'Color:';
        const colorSwatch = document.createElement('span');
        colorSwatch.className = 'light-color-swatch';
        colorSwatch.style.background = device.Color;
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = device.Color;
        colorInput.className = 'light-color-picker';
        colorInput.oninput = (e) => {
            device.Color = e.target.value;
            colorSwatch.style.background = device.Color;
        };
        colorInput.onchange = (e) => {
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} color changed.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderNotificationBadge();
        };
        colorControl.appendChild(colorLabel);
        colorControl.appendChild(colorSwatch);
        colorControl.appendChild(colorInput);
        card.appendChild(colorControl);
    }

    // Temperature controls for Thermostat/Air Conditioner
    if (device.DeviceType === 'Thermostat' || device.DeviceType === 'Air Conditioner') {
        const tempControl = document.createElement('div');
        tempControl.className = 'temp-control';
        const downBtn = document.createElement('button');
        downBtn.className = 'temp-btn';
        downBtn.textContent = '−';
        downBtn.title = 'Decrease Temperature';
        downBtn.onclick = (e) => {
            e.stopPropagation();
            device.Temperature--;
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} temperature set to ${device.Temperature}°C.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        };
        const tempValue = document.createElement('span');
        tempValue.className = 'temp-value';
        tempValue.textContent = `${device.Temperature}°C`;
        const upBtn = document.createElement('button');
        upBtn.className = 'temp-btn';
        upBtn.textContent = '+';
        upBtn.title = 'Increase Temperature';
        upBtn.onclick = (e) => {
            e.stopPropagation();
            device.Temperature++;
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${device.DeviceName} temperature set to ${device.Temperature}°C.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            renderDeviceGroups(filterRoom, currentSearch);
            renderNotificationBadge();
        };
        tempControl.appendChild(downBtn);
        tempControl.appendChild(tempValue);
        tempControl.appendChild(upBtn);
        card.appendChild(tempControl);
    }

    // Fan controls
    if (device.DeviceType === 'Fan') {
        const fanControl = document.createElement('div');
        fanControl.className = 'fan-control';
        // Speed
        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed:';
        const speedDown = document.createElement('button');
        speedDown.className = 'fan-speed-btn';
        speedDown.textContent = '−';
        speedDown.title = 'Decrease Speed';
        speedDown.onclick = (e) => {
            e.stopPropagation();
            if (device.Speed > 1) device.Speed--;
            speedValue.textContent = device.Speed;
            notify(`${device.DeviceName} speed set to ${device.Speed}.`);
        };
        const speedValue = document.createElement('span');
        speedValue.className = 'fan-speed-value';
        speedValue.textContent = device.Speed;
        const speedUp = document.createElement('button');
        speedUp.className = 'fan-speed-btn';
        speedUp.textContent = '+';
        speedUp.title = 'Increase Speed';
        speedUp.onclick = (e) => {
            e.stopPropagation();
            if (device.Speed < 3) device.Speed++;
            speedValue.textContent = device.Speed;
            notify(`${device.DeviceName} speed set to ${device.Speed}.`);
        };
        fanControl.appendChild(speedLabel);
        fanControl.appendChild(speedDown);
        fanControl.appendChild(speedValue);
        fanControl.appendChild(speedUp);
        // Oscillation
        const oscLabel = document.createElement('span');
        oscLabel.textContent = 'Oscillation:';
        const oscToggle = document.createElement('button');
        oscToggle.className = 'fan-osc-btn';
        oscToggle.textContent = device.Oscillation ? 'On' : 'Off';
        oscToggle.title = 'Toggle Oscillation';
        oscToggle.onclick = (e) => {
            e.stopPropagation();
            device.Oscillation = !device.Oscillation;
            oscToggle.textContent = device.Oscillation ? 'On' : 'Off';
            notify(`${device.DeviceName} oscillation ${device.Oscillation ? 'enabled' : 'disabled'}.`);
        };
        fanControl.appendChild(oscLabel);
        fanControl.appendChild(oscToggle);
        card.appendChild(fanControl);
    }
    // Speaker controls
    if (device.DeviceType === 'Speaker') {
        const speakerControl = document.createElement('div');
        speakerControl.className = 'speaker-control';
        // Volume
        const volLabel = document.createElement('span');
        volLabel.textContent = 'Volume:';
        const volDown = document.createElement('button');
        volDown.className = 'speaker-vol-btn';
        volDown.textContent = '−';
        volDown.title = 'Decrease Volume';
        volDown.onclick = (e) => {
            e.stopPropagation();
            if (device.Volume > 0) device.Volume--;
            volValue.textContent = device.Volume;
            notify(`${device.DeviceName} volume set to ${device.Volume}.`);
        };
        const volValue = document.createElement('span');
        volValue.className = 'speaker-vol-value';
        volValue.textContent = device.Volume;
        const volUp = document.createElement('button');
        volUp.className = 'speaker-vol-btn';
        volUp.textContent = '+';
        volUp.title = 'Increase Volume';
        volUp.onclick = (e) => {
            e.stopPropagation();
            if (device.Volume < 100) device.Volume++;
            volValue.textContent = device.Volume;
            notify(`${device.DeviceName} volume set to ${device.Volume}.`);
        };
        speakerControl.appendChild(volLabel);
        speakerControl.appendChild(volDown);
        speakerControl.appendChild(volValue);
        speakerControl.appendChild(volUp);
        // Mute
        const muteBtn = document.createElement('button');
        muteBtn.className = 'speaker-mute-btn';
        muteBtn.textContent = device.Muted ? 'Unmute' : 'Mute';
        muteBtn.title = device.Muted ? 'Unmute' : 'Mute';
        muteBtn.onclick = (e) => {
            e.stopPropagation();
            device.Muted = !device.Muted;
            muteBtn.textContent = device.Muted ? 'Unmute' : 'Mute';
            muteBtn.title = device.Muted ? 'Unmute' : 'Mute';
            notify(`${device.DeviceName} ${device.Muted ? 'muted' : 'unmuted'}.`);
        };
        speakerControl.appendChild(muteBtn);
        card.appendChild(speakerControl);
    }
    // TV controls
    if (device.DeviceType === 'TV') {
        const tvControl = document.createElement('div');
        tvControl.className = 'tv-control';
        // Channel
        const chLabel = document.createElement('span');
        chLabel.textContent = 'Channel:';
        const chDown = document.createElement('button');
        chDown.className = 'tv-ch-btn';
        chDown.textContent = '−';
        chDown.title = 'Previous Channel';
        chDown.onclick = (e) => {
            e.stopPropagation();
            if (device.Channel > 1) device.Channel--;
            chValue.textContent = device.Channel;
            notify(`${device.DeviceName} channel set to ${device.Channel}.`);
        };
        const chValue = document.createElement('span');
        chValue.className = 'tv-ch-value';
        chValue.textContent = device.Channel;
        const chUp = document.createElement('button');
        chUp.className = 'tv-ch-btn';
        chUp.textContent = '+';
        chUp.title = 'Next Channel';
        chUp.onclick = (e) => {
            e.stopPropagation();
            device.Channel++;
            chValue.textContent = device.Channel;
            notify(`${device.DeviceName} channel set to ${device.Channel}.`);
        };
        tvControl.appendChild(chLabel);
        tvControl.appendChild(chDown);
        tvControl.appendChild(chValue);
        tvControl.appendChild(chUp);
        // Volume
        const tvVolLabel = document.createElement('span');
        tvVolLabel.textContent = 'Volume:';
        const tvVolDown = document.createElement('button');
        tvVolDown.className = 'tv-vol-btn';
        tvVolDown.textContent = '−';
        tvVolDown.title = 'Decrease Volume';
        tvVolDown.onclick = (e) => {
            e.stopPropagation();
            if (device.Volume > 0) device.Volume--;
            tvVolValue.textContent = device.Volume;
            notify(`${device.DeviceName} volume set to ${device.Volume}.`);
        };
        const tvVolValue = document.createElement('span');
        tvVolValue.className = 'tv-vol-value';
        tvVolValue.textContent = device.Volume;
        const tvVolUp = document.createElement('button');
        tvVolUp.className = 'tv-vol-btn';
        tvVolUp.textContent = '+';
        tvVolUp.title = 'Increase Volume';
        tvVolUp.onclick = (e) => {
            e.stopPropagation();
            if (device.Volume < 100) device.Volume++;
            tvVolValue.textContent = device.Volume;
            notify(`${device.DeviceName} volume set to ${device.Volume}.`);
        };
        tvControl.appendChild(tvVolLabel);
        tvControl.appendChild(tvVolDown);
        tvControl.appendChild(tvVolValue);
        tvControl.appendChild(tvVolUp);
        // Source
        const srcLabel = document.createElement('span');
        srcLabel.textContent = 'Source:';
        const srcSelect = document.createElement('select');
        ['HDMI1', 'HDMI2', 'AV', 'TV'].forEach(src => {
            const opt = document.createElement('option');
            opt.value = src;
            opt.textContent = src;
            if (device.Source === src) opt.selected = true;
            srcSelect.appendChild(opt);
        });
        srcSelect.onchange = (e) => {
            device.Source = e.target.value;
            notify(`${device.DeviceName} source set to ${device.Source}.`);
        };
        tvControl.appendChild(srcLabel);
        tvControl.appendChild(srcSelect);
        card.appendChild(tvControl);
    }
    // Door Lock controls
    if (device.DeviceType === 'Door Lock') {
        const lockControl = document.createElement('div');
        lockControl.className = 'lock-control';
        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.textContent = device.Locked ? 'Unlock' : 'Lock';
        lockBtn.title = device.Locked ? 'Unlock Door' : 'Lock Door';
        lockBtn.onclick = (e) => {
            e.stopPropagation();
            device.Locked = !device.Locked;
            lockBtn.textContent = device.Locked ? 'Unlock' : 'Lock';
            lockBtn.title = device.Locked ? 'Unlock Door' : 'Lock Door';
            notify(`${device.DeviceName} ${device.Locked ? 'locked' : 'unlocked'}.`);
        };
        lockControl.appendChild(lockBtn);
        card.appendChild(lockControl);
    }
    // Curtain controls
    if (device.DeviceType === 'Curtain') {
        const curtainControl = document.createElement('div');
        curtainControl.className = 'curtain-control';
        const curtainLabel = document.createElement('span');
        curtainLabel.textContent = 'Open:';
        const curtainSlider = document.createElement('input');
        curtainSlider.type = 'range';
        curtainSlider.min = 0;
        curtainSlider.max = 100;
        curtainSlider.value = device.Position;
        curtainSlider.className = 'curtain-slider';
        curtainSlider.oninput = (e) => {
            device.Position = parseInt(e.target.value);
            curtainValue.textContent = device.Position + '%';
        };
        curtainSlider.onchange = (e) => {
            notify(`${device.DeviceName} opened to ${device.Position}%.`);
        };
        const curtainValue = document.createElement('span');
        curtainValue.className = 'curtain-value';
        curtainValue.textContent = device.Position + '%';
        curtainControl.appendChild(curtainLabel);
        curtainControl.appendChild(curtainSlider);
        curtainControl.appendChild(curtainValue);
        card.appendChild(curtainControl);
    }
    // Plug controls
    if (device.DeviceType === 'Plug') {
        const plugControl = document.createElement('div');
        plugControl.className = 'plug-control';
        const plugLabel = document.createElement('span');
        plugLabel.textContent = 'Timer:';
        const plugInput = document.createElement('input');
        plugInput.type = 'number';
        plugInput.min = 0;
        plugInput.max = 120;
        plugInput.value = device.Timer;
        plugInput.className = 'plug-timer-input';
        plugInput.onchange = (e) => {
            device.Timer = parseInt(e.target.value);
            notify(`${device.DeviceName} timer set to ${device.Timer} min.`);
        };
        plugControl.appendChild(plugLabel);
        plugControl.appendChild(plugInput);
        plugControl.appendChild(document.createTextNode('min'));
        card.appendChild(plugControl);
    }
    // Remove camera live badge and just show the icon for Camera
    if (device.DeviceType === 'Camera') {
        // No extra controls needed, just the icon is enough
    }
    // Air Purifier controls
    if (device.DeviceType === 'Air Purifier') {
        const apControl = document.createElement('div');
        apControl.className = 'ap-control';
        // Fan Speed
        const apSpeedLabel = document.createElement('span');
        apSpeedLabel.textContent = 'Fan:';
        const apSpeedDown = document.createElement('button');
        apSpeedDown.className = 'ap-speed-btn';
        apSpeedDown.textContent = '−';
        apSpeedDown.title = 'Decrease Fan Speed';
        apSpeedDown.onclick = (e) => {
            e.stopPropagation();
            if (device.FanSpeed > 1) device.FanSpeed--;
            apSpeedValue.textContent = device.FanSpeed;
            notify(`${device.DeviceName} fan speed set to ${device.FanSpeed}.`);
        };
        const apSpeedValue = document.createElement('span');
        apSpeedValue.className = 'ap-speed-value';
        apSpeedValue.textContent = device.FanSpeed;
        const apSpeedUp = document.createElement('button');
        apSpeedUp.className = 'ap-speed-btn';
        apSpeedUp.textContent = '+';
        apSpeedUp.title = 'Increase Fan Speed';
        apSpeedUp.onclick = (e) => {
            e.stopPropagation();
            if (device.FanSpeed < 3) device.FanSpeed++;
            apSpeedValue.textContent = device.FanSpeed;
            notify(`${device.DeviceName} fan speed set to ${device.FanSpeed}.`);
        };
        apControl.appendChild(apSpeedLabel);
        apControl.appendChild(apSpeedDown);
        apControl.appendChild(apSpeedValue);
        apControl.appendChild(apSpeedUp);
        // Mode
        const apModeLabel = document.createElement('span');
        apModeLabel.textContent = 'Mode:';
        const apModeSelect = document.createElement('select');
        ['Auto', 'Sleep', 'Turbo'].forEach(mode => {
            const opt = document.createElement('option');
            opt.value = mode;
            opt.textContent = mode;
            if (device.Mode === mode) opt.selected = true;
            apModeSelect.appendChild(opt);
        });
        apModeSelect.onchange = (e) => {
            device.Mode = e.target.value;
            notify(`${device.DeviceName} mode set to ${device.Mode}.`);
        };
        apControl.appendChild(apModeLabel);
        apControl.appendChild(apModeSelect);
        card.appendChild(apControl);
    }

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
                document.getElementById('add-event-modal').style.display = 'flex';
                document.getElementById('event-name-input').value = ev.name;
                document.getElementById('event-time-input').value = ev.time;
                document.getElementById('save-event-btn').textContent = 'Update';
                document.getElementById('add-event-form').onsubmit = function(e) {
                    e.preventDefault();
                    const name = document.getElementById('event-name-input').value.trim();
                    const time = document.getElementById('event-time-input').value;
                    if (!name || !time) return;
                    scheduleEvents[idx] = { name, time };
                    document.getElementById('add-event-modal').style.display = 'none';
                    document.getElementById('save-event-btn').textContent = 'Save';
                    renderSchedule();
                };
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
    document.querySelector('.tab-nav').style.display = 'none'; // Hide room tabs
    document.getElementById('main-header-title').textContent = 'Schedule'; // Set heading
    document.querySelector('.main-header-actions').style.display = 'none'; // Hide search
    renderSchedule();
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.getElementById('schedule-tab').classList.add('active');
};

document.querySelectorAll('.sidebar-nav li')[1].onclick = function() {
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('device-groups').style.display = '';
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

// Helper for notifications
function notify(msg) {
    const now = new Date();
    notifications.unshift({
        NotificationID: notifications.length + 1,
        UserID: 1,
        Message: msg,
        SentTime: now.toLocaleString(),
        Status: 'Unread'
    });
    renderNotificationBadge();
}
// Show Dashboard tab
document.querySelectorAll('.sidebar-nav li')[0].onclick = function() {
    document.getElementById('device-groups').style.display = 'none';
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = '';
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
