document.addEventListener('DOMContentLoaded', function() {
    const errorMessageElement = document.getElementById('errorMessage');
    const errorReasonsElement = document.getElementById('errorReasons');
    let redirectTimer;
    let countdown = 10;
    
    // Initialize error page
    displayErrorMessage();
    startAutoRedirect();
    
    function displayErrorMessage() {
        const urlParams = new URLSearchParams(window.location.search);
        const errorMessage = urlParams.get('message');
        
        if (errorMessage) {
            const sanitizedMessage = sanitizeHtml(decodeURIComponent(errorMessage));
            errorMessageElement.textContent = sanitizedMessage;
            
            // Update error reasons based on message type
            updateErrorReasons(sanitizedMessage);
        }
    }
    
    function updateErrorReasons(message) {
        const reasons = [];
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('credential') || lowerMessage.includes('password')) {
            reasons.push('Incorrect username or password entered');
            reasons.push('Account may be temporarily locked');
            reasons.push('Caps Lock might be enabled');
        } else if (lowerMessage.includes('session')) {
            reasons.push('Your session has expired');
            reasons.push('Browser cookies may be disabled');
            reasons.push('Multiple login attempts detected');
        } else if (lowerMessage.includes('rate') || lowerMessage.includes('attempt')) {
            reasons.push('Too many failed login attempts');
            reasons.push('Account temporarily locked for security');
            reasons.push('Wait 15 minutes before trying again');
        } else if (lowerMessage.includes('user') || lowerMessage.includes('found')) {
            reasons.push('Username does not exist in system');
            reasons.push('Account may have been deactivated');
            reasons.push('Contact administrator for assistance');
        } else {
            reasons.push('Network connectivity issues');
            reasons.push('Server temporarily unavailable');
            reasons.push('Browser compatibility issues');
        }
        
        // Update the reasons list
        errorReasonsElement.innerHTML = '';
        reasons.forEach(reason => {
            const li = document.createElement('li');
            li.textContent = reason;
            errorReasonsElement.appendChild(li);
        });
    }
    
    function startAutoRedirect() {
        const countdownElement = document.getElementById('countdown');
        
        redirectTimer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(redirectTimer);
                window.location.href = '/login';
            }
        }, 1000);
    }
    
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Expose global functions
    window.cancelRedirect = function() {
        if (redirectTimer) {
            clearInterval(redirectTimer);
            redirectTimer = null;
            
            const autoRedirectDiv = document.querySelector('.auto-redirect');
            autoRedirectDiv.innerHTML = '<p style="color: #00b894;">✅ Auto-redirect cancelled</p>';
        }
    };
    
    window.goBack = function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/login';
        }
    };
});