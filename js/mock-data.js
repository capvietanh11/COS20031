// Mock data for SmartHome Dashboard based on provided schema

const users = Array.from({length: 20}, (_, i) => ({
  UserID: i + 1,
  Username: `user${i+1}`,
  Password: `pass${i+1}`,
  Email: `user${i+1}@example.com`,
  PhoneNumber: `555-010${(i+1).toString().padStart(2, '0')}`,
  Role: i === 0 ? "Admin" : "User"
}));

const modules = Array.from({length: 20}, (_, i) => ({
  ModuleID: i + 1,
  ModuleName: `Module ${i+1}`,
  Location: ["Living Room", "Bedroom", "Kitchen", "Garage", "Office"][i%5],
  Description: `Controls devices in ${["Living Room", "Bedroom", "Kitchen", "Garage", "Office"][i%5]}`
}));

const deviceNames = [
  'Living Room Light',
  'Bedroom Thermostat',
  'Kitchen Camera',
  'Garage Sensor',
  'Office Plug',
  'Hallway Light',
  'Bathroom Heater',
  'Porch Camera',
  'Dining Room Light',
  'Kids Room Nightlight',
  'Master Bedroom AC',
  'Guest Room Heater',
  'Laundry Room Plug',
  'Backyard Sensor',
  'Garage Door Controller',
  'Living Room Speaker',
  'Bedroom Lamp',
  'Kitchen Plug',
  'Office Thermostat',
  'Entryway Camera'
];

const devices = Array.from({length: 20}, (_, i) => ({
  DeviceID: i + 1,
  ModuleID: (i % 20) + 1,
  DeviceName: deviceNames[i],
  DeviceType: ["Light", "Thermostat", "Camera", "Sensor", "Plug"][i%5],
  Location: ["Living Room", "Bedroom", "Kitchen", "Garage", "Office"][i%5],
  Status: ["On", "Off"][i%2]
}));

// Add unassigned and 'Other' devices for grouping demonstration
devices[19].Location = null; // This will become 'Unassigned'
devices[18].Location = 'Other';
devices[14].Location = 'Other';
devices[13].Location = null; // This will become 'Unassigned'

const eventLogs = Array.from({length: 20}, (_, i) => ({
  EventID: i + 1,
  RelatedUserID: (i % 20) + 1,
  RelatedDeviceID: (i % 20) + 1,
  EventType: ["Turned On", "Turned Off", "Temperature Set", "Motion Detected"][i%4],
  CreateAt: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:00:00Z`,
  Description: `Event ${i+1} description.`
}));

const securityAccesses = Array.from({length: 20}, (_, i) => ({
  AccessID: i + 1,
  UserID: (i % 20) + 1,
  AccessMethod: ["App", "Web", "Voice"][i%3],
  RelatedUserID: (i % 20) + 1,
  AccessTime: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:10:00Z`,
  Status: ["Success", "Failed"][i%2],
  IncorrectAttempts: i % 4
}));

const notifications = Array.from({length: 20}, (_, i) => ({
  NotificationID: i + 1,
  UserID: (i % 20) + 1,
  Message: `Notification message ${i+1}`,
  SentTime: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:15:00Z`,
  Status: ["Unread", "Read"][i%2]
}));

const sensorData = Array.from({length: 20}, (_, i) => ({
  SensorDataID: i + 1,
  DeviceID: (i % 20) + 1,
  CreatedAt: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:20:00Z`,
  Values: [
    `Brightness: ${50 + i}%`,
    `Temperature: ${20 + i}C`,
    `Motion: ${i%2 === 0 ? "Detected" : "None"}`,
    `Power: ${100 - i}W`
  ][i%4],
  Type: ["Light", "Thermostat", "Sensor", "Plug"][i%4]
}));

const deviceStatuses = Array.from({length: 20}, (_, i) => ({
  StatusID: i + 1,
  DeviceID: (i % 20) + 1,
  Status: ["On", "Off"][i%2],
  LastUpdated: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:25:00Z`,
  Type: ["Light", "Thermostat", "Sensor", "Plug"][i%4]
}));

const userDeviceControls = Array.from({length: 20}, (_, i) => ({
  UserID: (i % 20) + 1,
  DeviceID: (i % 20) + 1,
  ControlTime: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:30:00Z`,
  ControlAction: ["Turn On", "Turn Off", "Set Temperature", "Reset"][i%4]
}));

const schedules = Array.from({length: 20}, (_, i) => ({
  ScheduleID: i + 1,
  DeviceID: (i % 20) + 1,
  StartTime: `2024-06-${(i%30+1).toString().padStart(2, '0')}T0${i%10}:35:00Z`,
  EndTime: `2024-06-${(i%30+1).toString().padStart(2, '0')}T1${i%10}:35:00Z`,
  Action: ["Turn On", "Turn Off", "Set Temperature", "Reset"][i%4],
  Recurrence: ["Daily", "Weekly", "Monthly"][i%3]
}));

const automationRules = Array.from({length: 20}, (_, i) => ({
  RuleID: i + 1,
  RuleName: `Rule ${i+1}`,
  TriggerCondition: ["After 6PM", "Before 7AM", "Motion Detected", "Temperature Above 25C"][i%4],
  DeviceID: (i % 20) + 1,
  Action: ["Turn On", "Turn Off", "Set Temperature", "Reset"][i%4],
  IsActive: i % 2 === 0
}));

const ruleDevices = Array.from({length: 20}, (_, i) => ({
  DeviceID: (i % 20) + 1,
  RuleID: (i % 20) + 1,
  Action: ["Turn On", "Turn Off", "Set Temperature", "Reset"][i%4]
})); 