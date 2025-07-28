// ========================================
// GLOBAL STATE MANAGEMENT
// ========================================

// Global state variables
let currentSearch = '';
let currentRoom = 'all';
let editingDevice = null;
let currentSort = 'name-asc';
let scheduleEvents = []; // Each event: { name, time, devices: [{deviceId, status}]
let locations = ["Your Home", "Your Parent Home", "Your Office"];

// Helper: get unique rooms from devices
function getRooms(devices) {
    const rooms = new Set(devices.map(d => d.Location).filter(Boolean)); // filter(Boolean) removes null/undefined
    return Array.from(rooms).sort();
}

function getFilteredDevices(devices, filterRoom, searchText) {
    return devices.filter(device => {
        const inRoom = filterRoom === 'all' ? true : (device.Location === filterRoom);
        const matchesSearch = device.DeviceName.toLowerCase().includes(searchText.toLowerCase());
        return inRoom && matchesSearch;
    });
}

// Helper function: Hide all tabs
function hideAllTabs() {
    document.getElementById('device-groups').style.display = 'none';
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('analytics-section').style.display = 'none';
    document.getElementById('settings-section').style.display = 'none';
}

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

// Export for use in other modules
window.getRooms = getRooms;
window.getFilteredDevices = getFilteredDevices;
window.hideAllTabs = hideAllTabs;
window.notify = notify; 