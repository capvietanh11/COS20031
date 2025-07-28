// ========================================
// EVENT HANDLERS AND INITIALIZATION
// ========================================

// Initialize all event handlers
function initializeEventHandlers() {
    // Navigation event handlers
    document.querySelectorAll('.sidebar-nav li')[0].onclick = showDashboardTab;
    document.querySelectorAll('.sidebar-nav li')[1].onclick = showDevicesTab;
    document.getElementById('schedule-tab').onclick = showScheduleTab;
    document.querySelectorAll('.sidebar-nav li')[3].onclick = showAnalyticsTab;
    document.querySelector('.sidebar-settings').onclick = showSettingsTab;

    // Notification event handlers
    document.getElementById('notification-bell').onclick = renderNotificationPopup;
    document.getElementById('close-notification-popup').onclick = closeNotificationPopup;

    // Device modal event handlers
    document.getElementById('close-device-modal').onclick = closeDeviceModal;
    document.getElementById('cancel-device-btn').onclick = function(e) {
        e.preventDefault();
        closeDeviceModal();
    };

    // Device form submission
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

    // Device deletion
    document.getElementById('delete-device-btn').onclick = function(e) {
        e.preventDefault();
        if (!editingDevice) return;
        if (confirm(`Are you sure you want to delete ${editingDevice.DeviceName}?`)) {
            // Find index and remove device
            const deviceIndex = devices.findIndex(d => d.DeviceID === editingDevice.DeviceID);
            if (deviceIndex > -1) {
                devices.splice(deviceIndex, 1);
            }
            // Generate notification
            const now = new Date();
            notifications.unshift({
                NotificationID: notifications.length + 1,
                UserID: 1,
                Message: `${editingDevice.DeviceName} was deleted.`,
                SentTime: now.toLocaleString(),
                Status: 'Unread'
            });
            closeDeviceModal();
            renderRoomTabs(getRooms(devices));
            renderDeviceGroups(currentRoom, currentSearch);
            renderNotificationBadge();
        }
    };

    // Sort dropdown
    const sortDropdown = document.getElementById('sort-devices-dropdown');
    sortDropdown.addEventListener('change', function(e) {
        currentSort = e.target.value;
        renderDeviceGroups(currentRoom, currentSearch);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function(e) {
        renderDeviceGroups(currentRoom, e.target.value);
    });

    // Schedule event handlers
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

    // Settings event handlers
    const addLocForm = document.getElementById('add-location-form');
    if (addLocForm) {
        addLocForm.onsubmit = function(e) {
            e.preventDefault();
            const input = document.getElementById('new-location-input');
            const val = input.value.trim();
            if (val && !locations.includes(val)) {
                locations.push(val);
                renderLocationList();
                input.value = '';
            }
        };
    }

    // Settings button title
    document.querySelector('.sidebar-settings').setAttribute('title', 'Settings');

    // Location dropdown functionality
    const locationDropdown = document.getElementById('system-location-dropdown');
    if (locationDropdown) {
        locationDropdown.addEventListener('change', function(e) {
            const selectedLocation = e.target.value;
            const locationName = e.target.options[e.target.selectedIndex].text;
            
            // Navigate to location view
            window.location.href = `location-view.html?location=${encodeURIComponent(locationName)}`;
        });
    }
}

// Initialize the application
function initializeApp() {
    hideAllTabs(); // Hide all tabs on page load
    document.getElementById('dashboard-section').style.display = ''; // Default tab: dashboard
    document.querySelector('.tab-nav').style.display = 'none'; // Hide room tabs by default
    document.querySelector('.main-header-actions').style.display = 'none'; // Hide search by default
    
    const rooms = getRooms(devices);
    renderRoomTabs(rooms);
    renderDeviceGroups('all', '');
    renderNotificationBadge();
    renderLocationList();
    renderDashboard(); // Render dashboard content
    
    // Ensure currentUser and users are available globally for settings page
    if (typeof currentUser !== 'undefined') window.currentUser = currentUser;
    if (typeof users !== 'undefined') window.users = users;
}

// Export for use in other modules
window.initializeEventHandlers = initializeEventHandlers;
window.initializeApp = initializeApp; 