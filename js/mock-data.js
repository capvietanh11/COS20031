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

// Smarter mock data for SmartHome Dashboard

const devices = [
  // 1-20: Existing, but with logical DeviceType assignments
  {
    DeviceID: 1,
    ModuleID: 1,
    DeviceName: 'Living Room Light',
    DeviceType: 'Light',
    Location: 'Living Room',
    Status: 'On',
    Brightness: 80,
    Color: '#FFD700'
  },
  {
    DeviceID: 2,
    ModuleID: 2,
    DeviceName: 'Bedroom Thermostat',
    DeviceType: 'Thermostat',
    Location: 'Bedroom',
    Status: 'Off',
    Temperature: 22
  },
  {
    DeviceID: 3,
    ModuleID: 3,
    DeviceName: 'Kitchen Camera',
    DeviceType: 'Camera',
    Location: 'Kitchen',
    Status: 'On',
    Live: true
  },
  {
    DeviceID: 4,
    ModuleID: 4,
    DeviceName: 'Garage Sensor',
    DeviceType: 'Sensor',
    Location: 'Garage',
    Status: 'Off'
  },
  {
    DeviceID: 5,
    ModuleID: 5,
    DeviceName: 'Office Plug',
    DeviceType: 'Plug',
    Location: 'Office',
    Status: 'On',
    Timer: 30
  },
  {
    DeviceID: 6,
    ModuleID: 6,
    DeviceName: 'Hallway Light',
    DeviceType: 'Light',
    Location: 'Hallway',
    Status: 'Off',
    Brightness: 60,
    Color: '#FFFFFF'
  },
  {
    DeviceID: 7,
    ModuleID: 7,
    DeviceName: 'Bathroom Heater',
    DeviceType: 'Thermostat', // Heater as Thermostat
    Location: 'Bathroom',
    Status: 'On',
    Temperature: 25
  },
  {
    DeviceID: 8,
    ModuleID: 8,
    DeviceName: 'Porch Camera',
    DeviceType: 'Camera',
    Location: 'Porch',
    Status: 'On',
    Live: true
  },
  {
    DeviceID: 9,
    ModuleID: 9,
    DeviceName: 'Dining Room Light',
    DeviceType: 'Light',
    Location: 'Dining Room',
    Status: 'On',
    Brightness: 90,
    Color: '#FFA500'
  },
  {
    DeviceID: 10,
    ModuleID: 10,
    DeviceName: 'Kids Room Nightlight',
    DeviceType: 'Light',
    Location: 'Kids Room',
    Status: 'Off',
    Brightness: 20,
    Color: '#ADD8E6'
  },
  {
    DeviceID: 11,
    ModuleID: 11,
    DeviceName: 'Master Bedroom AC',
    DeviceType: 'Thermostat', // AC as Thermostat
    Location: 'Master Bedroom',
    Status: 'On',
    Temperature: 20
  },
  {
    DeviceID: 12,
    ModuleID: 12,
    DeviceName: 'Guest Room Heater',
    DeviceType: 'Thermostat', // Heater as Thermostat
    Location: 'Guest Room',
    Status: 'Off',
    Temperature: 23
  },
  {
    DeviceID: 13,
    ModuleID: 13,
    DeviceName: 'Laundry Room Plug',
    DeviceType: 'Plug',
    Location: 'Laundry Room',
    Status: 'On',
    Timer: 45
  },
  {
    DeviceID: 14,
    ModuleID: 14,
    DeviceName: 'Backyard Sensor',
    DeviceType: 'Sensor',
    Location: 'Backyard',
    Status: 'Off'
  },
  {
    DeviceID: 15,
    ModuleID: 15,
    DeviceName: 'Garage Door Controller',
    DeviceType: 'Door Lock',
    Location: 'Garage',
    Status: 'On',
    Locked: true
  },
  {
    DeviceID: 16,
    ModuleID: 16,
    DeviceName: 'Living Room Speaker',
    DeviceType: 'Speaker',
    Location: 'Living Room',
    Status: 'Off',
    Volume: 50,
    Muted: false
  },
  {
    DeviceID: 17,
    ModuleID: 17,
    DeviceName: 'Bedroom Lamp',
    DeviceType: 'Light',
    Location: 'Bedroom',
    Status: 'On',
    Brightness: 70,
    Color: '#FFFACD'
  },
  {
    DeviceID: 18,
    ModuleID: 18,
    DeviceName: 'Kitchen Plug',
    DeviceType: 'Plug',
    Location: 'Kitchen',
    Status: 'Off',
    Timer: 0
  },
  {
    DeviceID: 19,
    ModuleID: 19,
    DeviceName: 'Office Thermostat',
    DeviceType: 'Thermostat',
    Location: 'Office',
    Status: 'On',
    Temperature: 24
  },
  {
    DeviceID: 20,
    ModuleID: 20,
    DeviceName: 'Entryway Camera',
    DeviceType: 'Camera',
    Location: 'Entryway',
    Status: 'On',
    Live: true
  },
  // 21-30: 10 more realistic devices
  {
    DeviceID: 21,
    ModuleID: 21,
    DeviceName: 'Garage Fan',
    DeviceType: 'Fan',
    Location: 'Garage',
    Status: 'On',
    Speed: 2,
    Oscillation: true
  },
  {
    DeviceID: 22,
    ModuleID: 22,
    DeviceName: 'Porch Light',
    DeviceType: 'Light',
    Location: 'Porch',
    Status: 'Off',
    Brightness: 40,
    Color: '#FFF8DC'
  },
  {
    DeviceID: 23,
    ModuleID: 23,
    DeviceName: 'Dining Room Speaker',
    DeviceType: 'Speaker',
    Location: 'Dining Room',
    Status: 'On',
    Volume: 35,
    Muted: false
  },
  {
    DeviceID: 24,
    ModuleID: 24,
    DeviceName: 'Backyard Camera',
    DeviceType: 'Camera',
    Location: 'Backyard',
    Status: 'On',
    Live: true
  },
  {
    DeviceID: 25,
    ModuleID: 25,
    DeviceName: 'Living Room TV',
    DeviceType: 'TV',
    Location: 'Living Room',
    Status: 'Off',
    Channel: 5,
    Volume: 20,
    Source: 'HDMI1'
  },
  {
    DeviceID: 26,
    ModuleID: 26,
    DeviceName: 'Bedroom Curtain',
    DeviceType: 'Curtain',
    Location: 'Bedroom',
    Status: 'On',
    Position: 80
  },
  {
    DeviceID: 27,
    ModuleID: 27,
    DeviceName: 'Office Air Purifier',
    DeviceType: 'Air Purifier',
    Location: 'Office',
    Status: 'On',
    FanSpeed: 2,
    Mode: 'Auto'
  },
  {
    DeviceID: 28,
    ModuleID: 28,
    DeviceName: 'Kitchen Door Lock',
    DeviceType: 'Door Lock',
    Location: 'Kitchen',
    Status: 'Off',
    Locked: false
  },
  {
    DeviceID: 29,
    ModuleID: 29,
    DeviceName: 'Laundry Room TV',
    DeviceType: 'TV',
    Location: 'Laundry Room',
    Status: 'On',
    Channel: 12,
    Volume: 15,
    Source: 'AV'
  },
  {
    DeviceID: 30,
    ModuleID: 30,
    DeviceName: 'Entryway Plug',
    DeviceType: 'Plug',
    Location: 'Entryway',
    Status: 'Off',
    Timer: 10
  }
];

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

// Sensor data for devices that can detect (Camera, Sensor, etc.)
const sensorData = [
  // Kitchen Camera (DeviceID: 3)
  {
    SensorDataID: 1,
    DeviceID: 3,
    CreatedAt: '2024-06-01T08:20:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 2,
    DeviceID: 3,
    CreatedAt: '2024-06-01T09:20:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 3,
    DeviceID: 3,
    CreatedAt: '2024-06-01T10:20:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 4,
    DeviceID: 3,
    CreatedAt: '2024-06-01T11:20:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 5,
    DeviceID: 3,
    CreatedAt: '2024-06-01T12:20:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  // Porch Camera (DeviceID: 8)
  {
    SensorDataID: 6,
    DeviceID: 8,
    CreatedAt: '2024-06-01T08:30:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 7,
    DeviceID: 8,
    CreatedAt: '2024-06-01T09:30:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 8,
    DeviceID: 8,
    CreatedAt: '2024-06-01T10:30:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 9,
    DeviceID: 8,
    CreatedAt: '2024-06-01T11:30:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 10,
    DeviceID: 8,
    CreatedAt: '2024-06-01T12:30:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  // Entryway Camera (DeviceID: 20)
  {
    SensorDataID: 11,
    DeviceID: 20,
    CreatedAt: '2024-06-01T08:40:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 12,
    DeviceID: 20,
    CreatedAt: '2024-06-01T09:40:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 13,
    DeviceID: 20,
    CreatedAt: '2024-06-01T10:40:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 14,
    DeviceID: 20,
    CreatedAt: '2024-06-01T11:40:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 15,
    DeviceID: 20,
    CreatedAt: '2024-06-01T12:40:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  // Backyard Camera (DeviceID: 24)
  {
    SensorDataID: 16,
    DeviceID: 24,
    CreatedAt: '2024-06-01T08:50:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 17,
    DeviceID: 24,
    CreatedAt: '2024-06-01T09:50:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 18,
    DeviceID: 24,
    CreatedAt: '2024-06-01T10:50:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  {
    SensorDataID: 19,
    DeviceID: 24,
    CreatedAt: '2024-06-01T11:50:00Z',
    Values: 'Motion: None',
    Type: 'Camera'
  },
  {
    SensorDataID: 20,
    DeviceID: 24,
    CreatedAt: '2024-06-01T12:50:00Z',
    Values: 'Motion: Detected',
    Type: 'Camera'
  },
  // Garage Sensor (DeviceID: 4)
  {
    SensorDataID: 21,
    DeviceID: 4,
    CreatedAt: '2024-06-01T08:25:00Z',
    Values: 'Temperature: 21C',
    Type: 'Sensor'
  },
  {
    SensorDataID: 22,
    DeviceID: 4,
    CreatedAt: '2024-06-01T09:25:00Z',
    Values: 'Motion: None',
    Type: 'Sensor'
  },
  {
    SensorDataID: 23,
    DeviceID: 4,
    CreatedAt: '2024-06-01T10:25:00Z',
    Values: 'Temperature: 22C',
    Type: 'Sensor'
  },
  {
    SensorDataID: 24,
    DeviceID: 4,
    CreatedAt: '2024-06-01T11:25:00Z',
    Values: 'Motion: Detected',
    Type: 'Sensor'
  },
  {
    SensorDataID: 25,
    DeviceID: 4,
    CreatedAt: '2024-06-01T12:25:00Z',
    Values: 'Temperature: 23C',
    Type: 'Sensor'
  },
  // Backyard Sensor (DeviceID: 14)
  {
    SensorDataID: 26,
    DeviceID: 14,
    CreatedAt: '2024-06-01T08:55:00Z',
    Values: 'Motion: Detected',
    Type: 'Sensor'
  },
  {
    SensorDataID: 27,
    DeviceID: 14,
    CreatedAt: '2024-06-01T09:55:00Z',
    Values: 'Temperature: 19C',
    Type: 'Sensor'
  },
  {
    SensorDataID: 28,
    DeviceID: 14,
    CreatedAt: '2024-06-01T10:55:00Z',
    Values: 'Motion: None',
    Type: 'Sensor'
  },
  {
    SensorDataID: 29,
    DeviceID: 14,
    CreatedAt: '2024-06-01T11:55:00Z',
    Values: 'Temperature: 20C',
    Type: 'Sensor'
  },
  {
    SensorDataID: 30,
    DeviceID: 14,
    CreatedAt: '2024-06-01T12:55:00Z',
    Values: 'Motion: Detected',
    Type: 'Sensor'
  }
];

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