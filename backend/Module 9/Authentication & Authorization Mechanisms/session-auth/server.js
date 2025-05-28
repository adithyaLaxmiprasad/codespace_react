const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// User management module
const userManager = require('./userManager.js');

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE CONFIGURATION
// =========================

// Body parser middleware with size limits
app.use(bodyParser.urlencoded({ 
    extended: false,
    limit: '10mb'
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Session configuration with enhanced security
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // Change default session name
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict' // CSRF protection
    }
}));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Static files middleware
app.use('/static', express.static(path.join(__dirname, 'views')));

// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

// Enhanced authentication check with session validation
const requireAuth = (req, res, next) => {
    try {
        // Check if session exists and is valid
        if (!req.session || !req.session.user) {
            return res.redirect('/login?error=session_required');
        }
        
        // Validate session data integrity
        if (typeof req.session.user !== 'string' || req.session.user.trim() === '') {
            req.session.destroy((err) => {
                if (err) console.error('Session destruction error:', err);
            });
            return res.redirect('/login?error=invalid_session');
        }
        
        // Verify user still exists in system
        if (!userManager.userExists(req.session.user)) {
            req.session.destroy((err) => {
                if (err) console.error('Session destruction error:', err);
            });
            return res.redirect('/login?error=user_not_found');
        }
        
        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.redirect('/error?message=Authentication error occurred');
    }
};

// Input validation middleware
const validateLoginInput = (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Check for required fields
        if (!username || !password) {
            return res.redirect('/error?message=Please provide both username and password');
        }
        
        // Basic input sanitization and validation
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.redirect('/error?message=Invalid input format');
        }
        
        // Length validation
        if (username.trim().length === 0 || password.trim().length === 0) {
            return res.redirect('/error?message=Username and password cannot be empty');
        }
        
        if (username.length > 50 || password.length > 100) {
            return res.redirect('/error?message=Input length exceeds maximum allowed');
        }
        
        // Sanitize inputs
        req.body.username = username.trim();
        req.body.password = password.trim();
        
        next();
    } catch (error) {
        console.error('Input validation error:', error);
        res.redirect('/error?message=Input validation failed');
    }
};

// =========================
// ROUTE HANDLERS
// =========================

// Root route with enhanced logic
app.get('/', (req, res) => {
    try {
        if (req.session && req.session.user && userManager.userExists(req.session.user)) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Root route error:', error);
        res.redirect('/error?message=Server error occurred');
    }
});

// Login page route
app.get('/login', (req, res) => {
    try {
        // Redirect if already authenticated
        if (req.session && req.session.user && userManager.userExists(req.session.user)) {
            return res.redirect('/dashboard');
        }
        
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } catch (error) {
        console.error('Login route error:', error);
        res.redirect('/error?message=Unable to load login page');
    }
});

// Login processing with enhanced security
app.post('/login', validateLoginInput, (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Rate limiting check (basic implementation)
        const sessionKey = `login_attempts_${req.ip}`;
        if (!req.session[sessionKey]) {
            req.session[sessionKey] = { count: 0, lastAttempt: Date.now() };
        }
        
        const attempts = req.session[sessionKey];
        const now = Date.now();
        
        // Reset attempts after 15 minutes
        if (now - attempts.lastAttempt > 15 * 60 * 1000) {
            attempts.count = 0;
        }
        
        // Check rate limiting
        if (attempts.count >= 5) {
            return res.redirect('/error?message=Too many login attempts. Please try again later.');
        }
        
        // Validate credentials
        if (userManager.validateUser(username, password)) {
            // Successful login
            req.session.user = username;
            req.session.loginTime = new Date().toISOString();
            
            // Reset login attempts
            delete req.session[sessionKey];
            
            res.redirect('/dashboard');
        } else {
            // Failed login
            attempts.count++;
            attempts.lastAttempt = now;
            res.redirect('/error?message=Invalid credentials');
        }
    } catch (error) {
        console.error('Login processing error:', error);
        res.redirect('/error?message=Login processing failed');
    }
});

// Protected dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
    } catch (error) {
        console.error('Dashboard route error:', error);
        res.redirect('/error?message=Unable to load dashboard');
    }
});

// Logout with enhanced session cleanup
app.post('/logout', (req, res) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                    return res.redirect('/dashboard?error=logout_failed');
                }
                
                res.clearCookie('sessionId');
                res.redirect('/login?message=Successfully logged out');
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/error?message=Logout failed');
    }
});

// Error page route
app.get('/error', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'error.html'));
    } catch (error) {
        console.error('Error page route error:', error);
        res.status(500).send('Critical server error occurred');
    }
});

// =========================
// ERROR HANDLING MIDDLEWARE
// =========================

// 404 handler
app.use((req, res) => {
    res.status(404).redirect('/error?message=Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Don't expose error details in production
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(500).redirect(`/error?message=${encodeURIComponent(message)}`);
});

// =========================
// SERVER STARTUP
// =========================

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📝 Demo credentials:');
    userManager.getDemoCredentials().forEach(cred => {
        console.log(`   Username: ${cred.username}, Password: ${cred.password}`);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;