document.addEventListener('DOMContentLoaded', function() {
    const logoutForm = document.getElementById('logoutForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Display current time as login time
    updateLoginTime();
    
    // Handle logout with confirmation
    logoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '🔄 Logging out...';
            
            // Submit after short delay for UX
            setTimeout(() => {
                this.submit();
            }, 500);
        }
    });
    
    // Session activity tracking
    trackUserActivity();
    
    function updateLoginTime() {
        const loginTimeElement = document.getElementById('loginTime');
        if (loginTimeElement) {
            loginTimeElement.textContent = new Date().toLocaleString();
        }
    }
    
    function trackUserActivity() {
        let lastActivity = Date.now();
        
        // Track user interactions
        document.addEventListener('mousemove', updateActivity);
        document.addEventListener('keypress', updateActivity);
        document.addEventListener('click', updateActivity);
        
        function updateActivity() {
            lastActivity = Date.now();
        }
        
        // Check for inactivity every minute
        setInterval(() => {
            const now = Date.now();
            const inactiveTime = now - lastActivity;
            
            // Warn after 25 minutes of inactivity
            if (inactiveTime > 25 * 60 * 1000 && inactiveTime < 26 * 60 * 1000) {
                if (confirm('You have been inactive for 25 minutes. Do you want to stay logged in?')) {
                    lastActivity = Date.now(); // Reset activity
                }
            }
        }, 60000);
    }
    
    // Display any success messages from URL
    displaySuccessMessage();
    
    function displaySuccessMessage() {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        
        if (message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.style.cssText = `
                background: #e8f5e8;
                border: 1px solid #00b894;
                color: #00a085;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 20px;
                text-align: center;
            `;
            messageDiv.textContent = decodeURIComponent(message);
            
            const dashboardContent = document.querySelector('.dashboard-content');
            dashboardContent.insertBefore(messageDiv, dashboardContent.firstChild);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
});