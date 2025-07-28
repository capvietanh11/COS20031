// ========================================
// ANALYTICS FUNCTIONALITY
// ========================================

function renderAnalyticsDashboard() {
    // 1. Device Usage Statistics (Pie Chart)
    const deviceUsageData = [
        { name: 'Living Room Light', usage: 120 },
        { name: 'Bedroom AC', usage: 95 },
        { name: 'Kitchen Plug', usage: 80 },
        { name: 'Garage Door', usage: 60 },
        { name: 'TV', usage: 55 },
        { name: 'Other', usage: 40 }
    ];
    const pieCtx = document.getElementById('device-usage-chart').getContext('2d');
    if (window.deviceUsageChart) window.deviceUsageChart.destroy();
    window.deviceUsageChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: deviceUsageData.map(d => d.name),
            datasets: [{
                data: deviceUsageData.map(d => d.usage),
                backgroundColor: ['#6a93cb','#e3eafc','#ffd6d6','#a3e1d4','#f7b267','#b5b5b5']
            }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });
    document.getElementById('top-devices-list').innerHTML =
        '<b>Top 5 Devices:</b><br>' +
        deviceUsageData.slice(0,5).map(d => `${d.name}: ${d.usage} uses`).join('<br>');

    // 2. Sensor Data Trends (Line Chart)
    const sensorCtx = document.getElementById('sensor-trends-chart').getContext('2d');
    if (window.sensorTrendsChart) window.sensorTrendsChart.destroy();
    window.sensorTrendsChart = new Chart(sensorCtx, {
        type: 'line',
        data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
                { label: 'Temperature (°C)', data: [22,23,21,24,25,23,22], borderColor:'#f7b267', fill:false },
                { label: 'Humidity (%)', data: [55,60,58,62,59,57,56], borderColor:'#6a93cb', fill:false }
            ]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });

    // 3. Automation Rule Effectiveness (Bar Chart)
    const automationData = [
        { rule: 'Night Mode', triggered: 40, success: 38 },
        { rule: 'Away Mode', triggered: 25, success: 22 },
        { rule: 'Morning Routine', triggered: 30, success: 28 }
    ];
    const autoCtx = document.getElementById('automation-effectiveness-chart').getContext('2d');
    if (window.automationEffectivenessChart) window.automationEffectivenessChart.destroy();
    window.automationEffectivenessChart = new Chart(autoCtx, {
        type: 'bar',
        data: {
            labels: automationData.map(r => r.rule),
            datasets: [
                { label: 'Triggered', data: automationData.map(r => r.triggered), backgroundColor:'#6a93cb' },
                { label: 'Success', data: automationData.map(r => r.success), backgroundColor:'#a3e1d4' }
            ]
        },
        options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero:true } } }
    });
    document.getElementById('automation-rule-list').innerHTML =
        automationData.map(r => `${r.rule}: ${r.success}/${r.triggered} successful`).join('<br>');

    // 4. User Behavior Insights (Bar + Heatmap)
    const userBehaviorCtx = document.getElementById('user-behavior-chart').getContext('2d');
    if (window.userBehaviorChart) window.userBehaviorChart.destroy();
    window.userBehaviorChart = new Chart(userBehaviorCtx, {
        type: 'bar',
        data: {
            labels: ['Alice','Bob','Carol','Dave'],
            datasets: [{ label: 'Device Controls', data: [34,28,22,18], backgroundColor:'#f7b267' }]
        },
        options: { plugins: { legend: { display:false } }, scales: { y: { beginAtZero:true } } }
    });
    // Heatmap (simulate with stacked bar)
    const heatmapCtx = document.getElementById('user-heatmap-chart').getContext('2d');
    if (window.userHeatmapChart) window.userHeatmapChart.destroy();
    window.userHeatmapChart = new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: ['00','04','08','12','16','20'],
            datasets: [
                { label: 'Alice', data: [2,5,8,10,6,3], backgroundColor:'#6a93cb' },
                { label: 'Bob', data: [1,3,6,8,5,2], backgroundColor:'#f7b267' },
                { label: 'Carol', data: [0,2,4,7,3,1], backgroundColor:'#a3e1d4' }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } }, scales: { x: { stacked:true }, y: { stacked:true } } }
    });

    // 5. Security Access Logs (Pie + List)
    const securityCtx = document.getElementById('security-access-chart').getContext('2d');
    if (window.securityAccessChart) window.securityAccessChart.destroy();
    window.securityAccessChart = new Chart(securityCtx, {
        type: 'pie',
        data: {
            labels: ['Success','Failed'],
            datasets: [{ data: [120,8], backgroundColor:['#a3e1d4','#ffd6d6'] }]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
    document.getElementById('access-attempts-list').innerHTML =
        '<b>Access Attempts:</b><br>Alice: 60<br>Bob: 40<br>Carol: 20<br>Dave: 8';

    // 6. Device Health Trends (Line + List)
    const healthCtx = document.getElementById('device-health-chart').getContext('2d');
    if (window.deviceHealthChart) window.deviceHealthChart.destroy();
    window.deviceHealthChart = new Chart(healthCtx, {
        type: 'line',
        data: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
                { label: 'Online', data: [12,12,11,12,13,12,12], borderColor:'#6a93cb', fill:false },
                { label: 'Offline', data: [1,2,2,1,0,1,1], borderColor:'#ffd6d6', fill:false }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
    document.getElementById('device-health-list').innerHTML =
        '<b>Recent Updates:</b><br>Living Room Light: Today 09:12<br>Bedroom AC: Yesterday 22:30<br>Garage Door: Today 07:45';

    // 7. Event Log Summary (Bar + List)
    const eventLogCtx = document.getElementById('event-log-chart').getContext('2d');
    if (window.eventLogChart) window.eventLogChart.destroy();
    window.eventLogChart = new Chart(eventLogCtx, {
        type: 'bar',
        data: {
            labels: ['Turn On','Turn Off','Schedule','Error','Login'],
            datasets: [{ label: 'Events', data: [40,38,22,5,8], backgroundColor:'#6a93cb' }]
        },
        options: { plugins: { legend: { display:false } }, scales: { y: { beginAtZero:true } } }
    });
    document.getElementById('event-type-list').innerHTML =
        '<b>Top Events:</b><br>Turn On: 40<br>Turn Off: 38<br>Schedule: 22<br>Error: 5<br>Login: 8';

    // 8. Schedule vs Actual Usage (Line Chart)
    const scheduleCtx = document.getElementById('schedule-vs-actual-chart').getContext('2d');
    if (window.scheduleVsActualChart) window.scheduleVsActualChart.destroy();
    window.scheduleVsActualChart = new Chart(scheduleCtx, {
        type: 'line',
        data: {
            labels: ['00','04','08','12','16','20','24'],
            datasets: [
                { label: 'Scheduled', data: [2,4,6,8,6,4,2], borderColor:'#6a93cb', fill:false },
                { label: 'Actual', data: [1,3,5,7,5,3,1], borderColor:'#f7b267', fill:false }
            ]
        },
        options: { plugins: { legend: { position:'bottom' } } }
    });
}

// Export for use in other modules
window.renderAnalyticsDashboard = renderAnalyticsDashboard; 