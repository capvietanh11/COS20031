// ========================================
// NAVIGATION AND TAB SWITCHING
// ========================================

// Dashboard Tab
function showDashboardTab() {
    hideAllTabs();
    document.getElementById('dashboard-section').style.display = '';
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Dashboard';
    document.querySelector('.main-header-actions').style.display = 'none';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[0].classList.add('active');
    renderDashboard();
}

// Devices Tab
function showDevicesTab() {
    hideAllTabs();
    document.getElementById('device-groups').style.display = '';
    document.querySelector('.tab-nav').style.display = '';
    document.getElementById('main-header-title').textContent = 'Devices';
    document.querySelector('.main-header-actions').style.display = '';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[1].classList.add('active');
}

// Schedule Tab
function showScheduleTab() {
    hideAllTabs();
    document.getElementById('schedule-section').style.display = '';
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Schedule';
    document.querySelector('.main-header-actions').style.display = 'none';
    renderSchedule();
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.getElementById('schedule-tab').classList.add('active');
}

// Analytics Tab
function showAnalyticsTab() {
    hideAllTabs();
    document.getElementById('analytics-section').style.display = '';
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Analytics';
    document.querySelector('.main-header-actions').style.display = 'none';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li')[3].classList.add('active');
    renderAnalyticsDashboard();
}

// Settings Tab
function showSettingsTab() {
    hideAllTabs();
    document.getElementById('settings-section').style.display = '';
    document.querySelector('.tab-nav').style.display = 'none';
    document.getElementById('main-header-title').textContent = 'Settings';
    document.querySelector('.main-header-actions').style.display = 'none';
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    
    // Fill user info fields
    if (window.currentUser) {
        document.getElementById('user-info-username').textContent = window.currentUser.Username;
        document.getElementById('user-info-email').textContent = window.currentUser.Email;
        document.getElementById('user-info-phone').textContent = window.currentUser.PhoneNumber;
        document.getElementById('user-info-role').textContent = window.currentUser.Role;
    }
}

// Export for use in other modules
window.showDashboardTab = showDashboardTab;
window.showDevicesTab = showDevicesTab;
window.showScheduleTab = showScheduleTab;
window.showAnalyticsTab = showAnalyticsTab;
window.showSettingsTab = showSettingsTab; 