// ========================================
// SCHEDULE FUNCTIONALITY
// ========================================

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

        // If device supports level (e.g., Light, Speaker, Fan), show range input
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

// Export for use in other modules
window.formatTime = formatTime;
window.renderSchedule = renderSchedule;
window.openEventSettingModal = openEventSettingModal; 