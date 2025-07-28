// Chatbot FAB and Chat Window functionality
class ChatbotManager {
    constructor() {
        this.isDragging = false;
        this.isChatOpen = false;
        this.dragOffset = { x: 0, y: 0 };
        this.chatHistory = [];
        
        this.init();
    }

    init() {
        this.createChatbotFAB();
        this.createChatWindow();
        this.setupEventListeners();
        this.loadPosition();
        
        // Debug mock data availability
        setTimeout(() => {
            this.debugMockData();
        }, 1000);
    }

    createChatbotFAB() {
        console.log('🔧 Creating chatbot FAB...');
        
        // Check if chatbot image exists
        const img = new Image();
        img.onload = function() {
            console.log('✅ Chatbot image loaded successfully');
        };
        img.onerror = function() {
            console.error('❌ Chatbot image failed to load: assets/chatbot.jpg');
        };
        img.src = 'assets/chatbot.jpg';
        
        const fab = document.createElement('div');
        fab.id = 'chatbot-fab';
        fab.innerHTML = `
            <div class="fab-icon">
                <img src="assets/chatbot.jpg" alt="AI Assistant" class="chatbot-avatar">
            </div>
            <div class="fab-pulse"></div>
        `;
        document.body.appendChild(fab);
        console.log('✅ FAB created and added to body');
        
        // Check if FAB is visible
        setTimeout(() => {
            const fabElement = document.getElementById('chatbot-fab');
            if (fabElement) {
                console.log('🔍 FAB element found:', fabElement);
                console.log('🔍 FAB display:', fabElement.style.display);
                console.log('🔍 FAB position:', fabElement.style.left, fabElement.style.top);
                console.log('🔍 FAB z-index:', fabElement.style.zIndex);
                
                // Check if FAB is actually visible on screen
                const rect = fabElement.getBoundingClientRect();
                console.log('🔍 FAB bounding rect:', rect);
                console.log('🔍 FAB is visible:', rect.width > 0 && rect.height > 0);
            } else {
                console.error('❌ FAB element not found after creation');
            }
        }, 100);
    }

    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <img src="assets/chatbot.jpg" alt="AI Assistant" class="chat-avatar">
                    <span>SmartHome AI Assistant</span>
                </div>
                <div class="chat-controls">
                    <button class="clear-btn" onclick="chatbotManager.clearChat()" title="Clear Chat">🗑️</button>
                    <button class="minimize-btn" onclick="chatbotManager.minimizeChat()">−</button>
                    <button class="close-btn" onclick="chatbotManager.closeChat()">×</button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    <div class="message-avatar">
                        <img src="assets/chatbot.jpg" alt="AI Assistant">
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            Hello! I'm your SmartHome AI assistant. How can I help you today?
                        </div>
                        <div class="message-time">${this.getCurrentTime()}</div>
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <input type="text" id="chat-input" placeholder="Type your message..." maxlength="500">
                    <button class="send-btn" onclick="chatbotManager.sendMessage()" id="send-btn">
                        <span>➤</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(chatWindow);
    }

    setupEventListeners() {
        const fab = document.getElementById('chatbot-fab');
        const chatInput = document.getElementById('chat-input');

        // FAB click event
        fab.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.toggleChat();
            }
        });

        // FAB drag events
        fab.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Touch events for mobile
        fab.addEventListener('touchstart', (e) => this.startDrag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.stopDrag());

        // Chat input events
        if (chatInput) {
            chatInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    await this.sendMessage();
                }
            });
        }
    }

    startDrag(e) {
        this.isDragging = true;
        const fab = document.getElementById('chatbot-fab');
        const rect = fab.getBoundingClientRect();
        
        if (e.type === 'mousedown') {
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
        } else if (e.type === 'touchstart') {
            this.dragOffset.x = e.touches[0].clientX - rect.left;
            this.dragOffset.y = e.touches[0].clientY - rect.top;
        }
        
        fab.style.transition = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const fab = document.getElementById('chatbot-fab');
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        const newX = clientX - this.dragOffset.x;
        const newY = clientY - this.dragOffset.y;
        
        // Keep FAB within viewport bounds
        const maxX = window.innerWidth - fab.offsetWidth;
        const maxY = window.innerHeight - fab.offsetHeight;
        
        fab.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        fab.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            const fab = document.getElementById('chatbot-fab');
            fab.style.transition = 'all 0.3s ease';
            this.savePosition();
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const fab = document.getElementById('chatbot-fab');
        
        if (this.isChatOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        const fab = document.getElementById('chatbot-fab');
        
        // Get FAB position
        const fabRect = fab.getBoundingClientRect();
        let fabX = fabRect.left;
        let fabY = fabRect.top;
        
        // Get window dimensions
        const chatWidth = 380;
        const chatHeight = 500;
        
        // Ensure chat window doesn't go off-screen
        if (fabX + chatWidth > window.innerWidth) {
            fabX = window.innerWidth - chatWidth - 20;
        }
        
        if (fabY + chatHeight > window.innerHeight) {
            fabY = window.innerHeight - chatHeight - 20;
        }
        
        // Ensure minimum position
        if (fabX < 20) fabX = 20;
        if (fabY < 20) fabY = 20;
        
        // Position chat window at FAB location
        chatWindow.style.left = fabX + 'px';
        chatWindow.style.top = fabY + 'px';
        chatWindow.style.right = 'auto';
        chatWindow.style.bottom = 'auto';
        
        chatWindow.style.display = 'flex';
        fab.style.display = 'none';
        this.isChatOpen = true;
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
        }, 300);
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        const fab = document.getElementById('chatbot-fab');
        
        chatWindow.style.display = 'none';
        fab.style.display = 'flex';
        this.isChatOpen = false;
    }

    minimizeChat() {
        const chatWindow = document.getElementById('chat-window');
        const fab = document.getElementById('chatbot-fab');
        
        // Get chat window position
        const chatRect = chatWindow.getBoundingClientRect();
        const chatX = chatRect.left;
        const chatY = chatRect.top;
        
        // Position FAB at chat window location
        fab.style.left = chatX + 'px';
        fab.style.top = chatY + 'px';
        
        chatWindow.style.display = 'none';
        fab.style.display = 'flex';
        this.isChatOpen = false;
        
        // Save the new FAB position
        this.savePosition();
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Disable send button and show loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>⏳</span>';
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response from Gemini
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator and add bot response
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I'm having trouble processing your request right now. Please try again.", 'bot');
        } finally {
            // Re-enable send button
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span>➤</span>';
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
                <div class="message-avatar">
                    <span>👤</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="assets/chatbot.jpg" alt="AI Assistant">
                </div>
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in chat history
        this.chatHistory.push({ text, sender, timestamp: new Date() });
    }

    async getAIResponse(userMessage) {
        // Check if we should bypass API (for rate limit issues)
        const bypassAPI = localStorage.getItem('chatbot_bypass_api') === 'true';
        if (bypassAPI) {
            console.log('🔄 Bypassing API, using fallback responses');
            return this.getEnhancedFallbackResponse(userMessage);
        }

        try {
            console.log('🔍 Starting Gemini API call...');
            console.log('📝 User message:', userMessage);
            
            // Check if mock data is available
            if (typeof devices === 'undefined') {
                console.error('❌ Mock data not found! devices variable is undefined');
                throw new Error('Mock data not available');
            }
            
            if (typeof notifications === 'undefined') {
                console.error('❌ Mock data not found! notifications variable is undefined');
                throw new Error('Mock data not available');
            }
            
            if (typeof securityAccesses === 'undefined') {
                console.error('❌ Mock data not found! securityAccesses variable is undefined');
                throw new Error('Mock data not available');
            }
            
            console.log('✅ Mock data found:', {
                devicesCount: devices.length,
                notificationsCount: notifications.length,
                securityAccessesCount: securityAccesses.length
            });

            // Prepare optimized context with minimal data
            const deviceSummary = {
                total: devices.length,
                active: devices.filter(d => d.Status === 'On').length,
                types: devices.reduce((acc, d) => {
                    acc[d.DeviceType] = (acc[d.DeviceType] || 0) + 1;
                    return acc;
                }, {}),
                locations: devices.reduce((acc, d) => {
                    acc[d.Location] = (acc[d.Location] || 0) + 1;
                    return acc;
                }, {})
            };

            const recentNotifications = notifications.slice(0, 3).map(n => n.Message);
            
            const context = `
You are a SmartHome AI Assistant. Smart home summary:
- Total devices: ${deviceSummary.total}
- Active devices: ${deviceSummary.active}
- Device types: ${JSON.stringify(deviceSummary.types)}
- Recent notifications: ${recentNotifications.join(', ')}

User message: ${userMessage}

Provide a helpful response about the smart home system.`;

            // Estimate token usage (roughly 4 characters per token)
            const estimatedTokens = Math.ceil(context.length / 4);
            console.log('📊 Estimated tokens:', estimatedTokens);

            console.log('📤 Sending request to Gemini API...');
            console.log('🔑 API Key:', 'AIzaSyBr0xxbWrSauQkCPX-LhvzQXA6OPX52t84');
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: context
                    }]
                }]
            };
            
            console.log('📦 Request body:', requestBody);

            // Call Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyBr0xxbWrSauQkCPX-LhvzQXA6OPX52t84`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();
            console.log('📥 Gemini API Response:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                console.log('✅ AI Response:', aiResponse);
                return aiResponse;
            } else {
                console.error('❌ Invalid response format:', data);
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('❌ Error calling Gemini API:', error);
            console.error('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Check if it's a rate limit error
            if (error.message.includes('429') || error.message.includes('quota')) {
                console.log('⚠️ Rate limit exceeded, using enhanced fallback responses');
                console.log('💡 Consider upgrading API quota or using fallback mode');
                return this.getEnhancedFallbackResponse(userMessage);
            }
            
            // Regular fallback responses for other errors
            const fallbackResponses = {
                'hello': 'Hello! How can I help you with your smart home today?',
                'help': 'I can help you control devices, check status, set schedules, and answer questions about your smart home system.',
                'devices': 'I can show you all your connected devices and their current status. Would you like me to list them?',
                'lights': 'I can help you control your smart lights. You can turn them on/off, adjust brightness, or change colors.',
                'temperature': 'I can help you adjust your thermostat settings. What temperature would you like to set?',
                'security': 'I can help you check your security system status, arm/disarm, or view camera feeds.',
                'schedule': 'I can help you set up automation schedules for your devices. What would you like to schedule?',
                'energy': 'I can show you your current energy usage and provide tips to save energy.',
                'status': 'I can check the status of all your devices. Would you like me to do a quick system check?'
            };
            
            const lowerMessage = userMessage.toLowerCase();
            
            for (const [key, response] of Object.entries(fallbackResponses)) {
                if (lowerMessage.includes(key)) {
                    console.log('🔄 Using fallback response for:', key);
                    return response;
                }
            }
            
            console.log('🔄 Using generic fallback response');
            return "I'm having trouble connecting to my AI service right now. I'm here to help with your smart home system. You can ask me about devices, lights, temperature, security, schedules, or energy usage.";
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    savePosition() {
        const fab = document.getElementById('chatbot-fab');
        const position = {
            x: fab.style.left,
            y: fab.style.top
        };
        localStorage.setItem('chatbotPosition', JSON.stringify(position));
    }

    loadPosition() {
        const savedPosition = localStorage.getItem('chatbotPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            const fab = document.getElementById('chatbot-fab');
            fab.style.left = position.x;
            fab.style.top = position.y;
        }
    }

    // Debug function to check mock data availability
    debugMockData() {
        console.log('🔍 Checking mock data availability...');
        console.log('devices:', typeof devices, devices);
        console.log('notifications:', typeof notifications, notifications);
        console.log('securityAccesses:', typeof securityAccesses, securityAccesses);
        
        if (typeof devices !== 'undefined') {
            console.log('✅ devices loaded, count:', devices.length);
        } else {
            console.error('❌ devices not loaded');
        }
        
        if (typeof notifications !== 'undefined') {
            console.log('✅ notifications loaded, count:', notifications.length);
        } else {
            console.error('❌ notifications not loaded');
        }
        
        if (typeof securityAccesses !== 'undefined') {
            console.log('✅ securityAccesses loaded, count:', securityAccesses.length);
        } else {
            console.error('❌ securityAccesses not loaded');
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/chatbot.jpg" alt="AI Assistant">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            // Clear all messages except the initial greeting
            const initialMessage = messagesContainer.querySelector('.message.bot-message');
            messagesContainer.innerHTML = '';
            
            // Add back the initial greeting
            if (initialMessage) {
                messagesContainer.appendChild(initialMessage.cloneNode(true));
            } else {
                // If no initial message found, create a new one
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'message bot-message';
                welcomeDiv.innerHTML = `
                    <div class="message-avatar">
                        <img src="assets/chatbot.jpg" alt="AI Assistant">
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            Hello! I'm your SmartHome AI assistant. How can I help you today?
                        </div>
                        <div class="message-time">${this.getCurrentTime()}</div>
                    </div>
                `;
                messagesContainer.appendChild(welcomeDiv);
            }
            
            // Clear chat history
            this.chatHistory = [];
            
            console.log('🗑️ Chat history cleared');
        }
    }

    getEnhancedFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Check if mock data is available
        if (typeof devices === 'undefined' || typeof notifications === 'undefined') {
            return "I'm currently experiencing high demand. Please try again later or ask me about your smart home devices, notifications, or security.";
        }
        
        // Device-related queries
        if (lowerMessage.includes('device') || lowerMessage.includes('devices')) {
            const activeDevices = devices.filter(d => d.Status === 'On').length;
            const totalDevices = devices.length;
            return `I can see you have ${totalDevices} devices connected to your smart home system. Currently, ${activeDevices} devices are active. Your devices include smart lights, cameras, thermostats, and security systems. Would you like me to show you specific device status?`;
        }
        
        // Light-related queries
        if (lowerMessage.includes('light') || lowerMessage.includes('lights')) {
            const lights = devices.filter(d => d.DeviceType.toLowerCase().includes('light'));
            const activeLights = lights.filter(d => d.Status === 'On').length;
            return `You have ${lights.length} smart lights in your home. Currently, ${activeLights} lights are on. You can control brightness, colors, and schedules for all your lights.`;
        }
        
        // Camera-related queries
        if (lowerMessage.includes('camera') || lowerMessage.includes('cameras')) {
            const cameras = devices.filter(d => d.DeviceType.toLowerCase().includes('camera'));
            const activeCameras = cameras.filter(d => d.Status === 'On').length;
            return `You have ${cameras.length} security cameras installed. ${activeCameras} cameras are currently active and monitoring your home. You can view live feeds and recorded footage.`;
        }
        
        // Temperature/thermostat queries
        if (lowerMessage.includes('temperature') || lowerMessage.includes('thermostat') || lowerMessage.includes('temp')) {
            const thermostats = devices.filter(d => d.DeviceType.toLowerCase().includes('thermostat'));
            return `You have ${thermostats.length} smart thermostats. They help you maintain optimal temperature and save energy. You can adjust settings remotely and set schedules.`;
        }
        
        // Security queries
        if (lowerMessage.includes('security') || lowerMessage.includes('lock') || lowerMessage.includes('alarm')) {
            const securityDevices = devices.filter(d => 
                d.DeviceType.toLowerCase().includes('lock') || 
                d.DeviceType.toLowerCase().includes('alarm') ||
                d.DeviceType.toLowerCase().includes('sensor')
            );
            return `Your security system includes ${securityDevices.length} devices including locks, sensors, and alarms. All systems are operational and protecting your home.`;
        }
        
        // Notification queries
        if (lowerMessage.includes('notification') || lowerMessage.includes('alert')) {
            const recentNotifications = notifications.slice(0, 3);
            return `You have ${notifications.length} recent notifications. Latest alerts include: ${recentNotifications.map(n => n.message).join(', ')}.`;
        }
        
        // Status queries
        if (lowerMessage.includes('status') || lowerMessage.includes('system')) {
            const activeDevices = devices.filter(d => d.Status === 'On').length;
            const totalDevices = devices.length;
            return `Your smart home system is running smoothly! ${activeDevices} out of ${totalDevices} devices are currently active. All systems are operational.`;
        }
        
        // General help
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return `I can help you with your smart home! I can show you device status, control lights and cameras, check security systems, view notifications, and help with automation. What would you like to know?`;
        }
        
        // Greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `Hello! I'm your SmartHome AI assistant. I can help you control and monitor your smart home devices. What would you like to know about your home?`;
        }
        
        // Default response
        return `I understand you're asking about "${userMessage}". I can help you with your smart home devices, security, notifications, and automation. What specific information would you like?`;
    }
}

// Initialize chatbot when DOM is loaded
let chatbotManager;
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing ChatbotManager...');
    try {
        chatbotManager = new ChatbotManager();
        window.chatbotManager = chatbotManager;
        console.log('✅ ChatbotManager initialized successfully');
        
        // Check if elements were created
        setTimeout(() => {
            const fab = document.getElementById('chatbot-fab');
            const chatWindow = document.getElementById('chat-window');
            console.log('🔍 Checking chatbot elements:');
            console.log('- FAB exists:', !!fab);
            console.log('- Chat window exists:', !!chatWindow);
            if (fab) {
                console.log('- FAB display:', fab.style.display);
                console.log('- FAB position:', fab.style.left, fab.style.top);
            }
        }, 1000);
    } catch (error) {
        console.error('❌ Error initializing ChatbotManager:', error);
    }
});

// Global test function for debugging
window.testGeminiAPI = async function() {
    console.log('🧪 Testing Gemini API...');
    
    // Test 1: Check if mock data is available
    console.log('📊 Mock Data Check:');
    console.log('- devices:', typeof devices, devices ? devices.length : 'undefined');
    console.log('- notifications:', typeof notifications, notifications ? notifications.length : 'undefined');
    console.log('- securityAccesses:', typeof securityAccesses, securityAccesses ? securityAccesses.length : 'undefined');
    
    // Test 2: Try a simple API call
    if (typeof devices !== 'undefined' && devices.length > 0) {
        console.log('✅ Mock data available, testing API call...');
        try {
            const testResponse = await chatbotManager.getAIResponse('Hello, show me my devices');
            console.log('✅ API Test Success:', testResponse);
        } catch (error) {
            console.error('❌ API Test Failed:', error);
        }
    } else {
        console.error('❌ Mock data not available');
    }
};

// Global function to manually open chat
window.openChatbot = function() {
    if (chatbotManager) {
        console.log('🔓 Manually opening chat...');
        chatbotManager.openChat();
    } else {
        console.error('❌ ChatbotManager not initialized');
    }
};

// Global function to toggle API bypass (for rate limit issues)
window.toggleChatbotAPI = function() {
    const current = localStorage.getItem('chatbot_bypass_api') === 'true';
    const newValue = !current;
    localStorage.setItem('chatbot_bypass_api', newValue.toString());
    console.log(`🔄 API bypass ${newValue ? 'enabled' : 'disabled'}`);
    return newValue;
};

// Global function to check current API status
window.getChatbotAPIStatus = function() {
    const bypassed = localStorage.getItem('chatbot_bypass_api') === 'true';
    console.log(`📊 API Status: ${bypassed ? 'Bypassed (using fallback)' : 'Active (using Gemini)'}`);
    return bypassed;
}; 