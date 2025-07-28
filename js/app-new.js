// ========================================
// SMART HOME DASHBOARD - MAIN APPLICATION
// ========================================

// Load all modules in dependency order
// 1. Core state management (must be first)
// 2. Notifications system
// 3. Device icons and controls
// 4. Device cards and rendering
// 5. Modals and dialogs
// 6. Schedule functionality
// 7. Dashboard functionality
// 8. Analytics functionality
// 9. Settings functionality
// 10. Navigation system
// 11. Event handlers and initialization

// Initialize the application when DOM is loaded
window.onload = function() {
    // Initialize event handlers
    initializeEventHandlers();
    
    // Initialize the application
    initializeApp();
}; 