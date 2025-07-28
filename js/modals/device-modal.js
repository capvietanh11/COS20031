// ========================================
// DEVICE MODAL FUNCTIONALITY
// ========================================

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

// --- Sensor Data Modal ---
function showSensorDataModal(deviceId) {
    // Find sensor data for this device
    const data = sensorData.filter(d => d.DeviceID === deviceId);
    let modal = document.getElementById('sensor-data-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sensor-data-modal';
        modal.className = 'device-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="device-modal-content">
                <div class="device-modal-header">
                    <span>Sensor Data</span>
                    <button id="close-sensor-data-modal">✖</button>
                </div>
                <div id="sensor-data-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
    // Fill content
    const content = modal.querySelector('#sensor-data-content');
    if (data.length === 0) {
        content.innerHTML = '<div style="color:#888;padding:1.5rem;">No sensor data available.</div>';
    } else {
        content.innerHTML = data.map(d => `
            <div style="margin-bottom:1rem;">
                <div><b>Time:</b> ${d.CreatedAt}</div>
                <div><b>Value:</b> ${d.Values}</div>
            </div>
        `).join('');
    }
    // Close button
    modal.querySelector('#close-sensor-data-modal').onclick = function() {
        modal.style.display = 'none';
    };
}

// Export for use in other modules
window.openDeviceModal = openDeviceModal;
window.closeDeviceModal = closeDeviceModal;
window.showSensorDataModal = showSensorDataModal; 