// ========================================
// DEVICE-SPECIFIC CONTROLS
// ========================================

// Light controls
function createLightControls(device, card, filterRoom) {
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
}

// Temperature controls for Thermostat/Air Conditioner
function createTemperatureControls(device, card, filterRoom) {
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
function createFanControls(device, card) {
    // Speed Controls (row 1)
    const fanSpeedControl = document.createElement('div');
    fanSpeedControl.className = 'fan-speed-control';
    fanSpeedControl.style.display = 'flex';
    fanSpeedControl.style.alignItems = 'center';
    fanSpeedControl.style.gap = '0.5rem';
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
    fanSpeedControl.appendChild(speedLabel);
    fanSpeedControl.appendChild(speedDown);
    fanSpeedControl.appendChild(speedValue);
    fanSpeedControl.appendChild(speedUp);
    card.appendChild(fanSpeedControl);
    
    // Oscillation Controls (row 2)
    const fanOscControl = document.createElement('div');
    fanOscControl.className = 'fan-osc-control';
    fanOscControl.style.display = 'flex';
    fanOscControl.style.alignItems = 'center';
    fanOscControl.style.gap = '0.5rem';
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
    fanOscControl.appendChild(oscLabel);
    fanOscControl.appendChild(oscToggle);
    card.appendChild(fanOscControl);
}

// Speaker controls
function createSpeakerControls(device, card) {
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
    card.appendChild(speakerControl);
    
    // Mute (on new line)
    const muteRow = document.createElement('div');
    muteRow.style.marginTop = '0.5rem';
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
    muteRow.appendChild(muteBtn);
    card.appendChild(muteRow);
}

// TV controls
function createTVControls(device, card) {
    // Channel Controls (row 1)
    const tvChannelControl = document.createElement('div');
    tvChannelControl.className = 'tv-channel-control';
    tvChannelControl.style.display = 'flex';
    tvChannelControl.style.alignItems = 'center';
    tvChannelControl.style.gap = '0.5rem';
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
    tvChannelControl.appendChild(chLabel);
    tvChannelControl.appendChild(chDown);
    tvChannelControl.appendChild(chValue);
    tvChannelControl.appendChild(chUp);
    card.appendChild(tvChannelControl);
    
    // Volume Controls (row 2)
    const tvVolumeControl = document.createElement('div');
    tvVolumeControl.className = 'tv-volume-control';
    tvVolumeControl.style.display = 'flex';
    tvVolumeControl.style.alignItems = 'center';
    tvVolumeControl.style.gap = '0.5rem';
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
    tvVolumeControl.appendChild(tvVolLabel);
    tvVolumeControl.appendChild(tvVolDown);
    tvVolumeControl.appendChild(tvVolValue);
    tvVolumeControl.appendChild(tvVolUp);
    card.appendChild(tvVolumeControl);
    
    // Source Controls (row 3)
    const tvSourceControl = document.createElement('div');
    tvSourceControl.className = 'tv-source-control';
    tvSourceControl.style.display = 'flex';
    tvSourceControl.style.alignItems = 'center';
    tvSourceControl.style.gap = '0.5rem';
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
    tvSourceControl.appendChild(srcLabel);
    tvSourceControl.appendChild(srcSelect);
    card.appendChild(tvSourceControl);
}

// Door Lock controls
function createDoorLockControls(device, card) {
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
function createCurtainControls(device, card) {
    const curtainPositionControl = document.createElement('div');
    curtainPositionControl.className = 'curtain-position-control';
    curtainPositionControl.style.display = 'flex';
    curtainPositionControl.style.alignItems = 'center';
    curtainPositionControl.style.gap = '0.5rem';
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
    curtainPositionControl.appendChild(curtainLabel);
    curtainPositionControl.appendChild(curtainSlider);
    curtainPositionControl.appendChild(curtainValue);
    card.appendChild(curtainPositionControl);
}

// Plug controls
function createPlugControls(device, card) {
    const plugTimerControl = document.createElement('div');
    plugTimerControl.className = 'plug-timer-control';
    plugTimerControl.style.display = 'flex';
    plugTimerControl.style.alignItems = 'center';
    plugTimerControl.style.gap = '0.5rem';
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
    plugTimerControl.appendChild(plugLabel);
    plugTimerControl.appendChild(plugInput);
    plugTimerControl.appendChild(document.createTextNode('min'));
    card.appendChild(plugTimerControl);
}

// Air Purifier controls
function createAirPurifierControls(device, card) {
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

// Export for use in other modules
window.createLightControls = createLightControls;
window.createTemperatureControls = createTemperatureControls;
window.createFanControls = createFanControls;
window.createSpeakerControls = createSpeakerControls;
window.createTVControls = createTVControls;
window.createDoorLockControls = createDoorLockControls;
window.createCurtainControls = createCurtainControls;
window.createPlugControls = createPlugControls;
window.createAirPurifierControls = createAirPurifierControls; 