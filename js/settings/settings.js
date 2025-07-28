// ========================================
// SETTINGS FUNCTIONALITY
// ========================================

function renderLocationList() {
    const list = document.getElementById('location-list');
    if (!list) return;
    list.innerHTML = '';
    locations.forEach(loc => {
        const li = document.createElement('li');
        li.textContent = loc;
        li.style.padding = '0.4rem 0';
        list.appendChild(li);
    });
}

// Export for use in other modules
window.renderLocationList = renderLocationList; 