document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');
    const messageArea = document.getElementById('messageArea');
    
    // Input validation patterns
    const validationRules = {
        username: {
            required: true,
            minLength: 1,
            maxLength: 50,
            pattern: /^[a-zA-Z0-9_-]+$/
        },
        password: {
            required: true,
            minLength: 1,
            maxLength: 100
        }
    };
    
    // Display URL messages
    displayUrlMessage();
    
    // Password toggle functionality
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Real-time validation
    usernameInput.addEventListener('input', function() {
        validateField('username', this.value);
    });
    
    passwordInput.addEventListener('input', function() {
        validateField('password', this.value);
    });
    
    // Form submission with validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showLoading(true);
            
            // Simulate network delay for better UX
            setTimeout(() => {
                this.submit();
            }, 500);
        }
    });
    
    // Validation functions
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);
        let errorMessage = '';
        
        if (rules.required && !value.trim()) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        } else if (value.length < rules.minLength) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} character(s)`;
        } else if (value.length > rules.maxLength) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${rules.maxLength} characters`;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            errorMessage = 'Username can only contain letters, numbers, hyphens, and underscores';
        }
        
        if (errorMessage) {
            errorElement.textContent = errorMessage;
            inputElement.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            inputElement.classList.remove('error');
            return true;
        }
    }
    
    function validateForm() {
        const usernameValid = validateField('username', usernameInput.value);
        const passwordValid = validateField('password', passwordInput.value);
        
        return usernameValid && passwordValid;
    }
    
    function showLoading(show) {
        const btnText = document.querySelector('.btn-text');
        const btnSpinner = document.querySelector('.btn-spinner');
        
        if (show) {
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }
    
    function displayUrlMessage() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const message = urlParams.get('message');
        
        if (error || message) {
            let displayMessage = '';
            let messageType = 'error';
            
            if (error) {
                switch (error) {
                    case 'session_required':
                        displayMessage = 'Please log in to access this page';
                        break;
                    case 'invalid_session':
                        displayMessage = 'Your session has expired. Please log in again';
                        break;
                    case 'user_not_found':
                        displayMessage = 'User account not found. Please contact support';
                        break;
                    default:
                        displayMessage = sanitizeHtml(decodeURIComponent(error));
                }
            } else if (message) {
                displayMessage = sanitizeHtml(decodeURIComponent(message));
                messageType = 'success';
            }
            
            showMessage(displayMessage, messageType);
        }
    }
    
    function showMessage(message, type = 'error') {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        messageArea.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageArea.style.display = 'none';
            }, 5000);
        }
    }
    
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Expose fillCredentials function globally for demo buttons
    window.fillCredentials = function(username, password) {
        usernameInput.value = username;
        passwordInput.value = password;
        
        // Trigger validation
        validateField('username', username);
        validateField('password', password);
        
        // Focus the login button
        loginBtn.focus();
    };
});