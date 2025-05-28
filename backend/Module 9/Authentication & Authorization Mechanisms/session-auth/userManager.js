const crypto = require('crypto');

// Enhanced user storage with hashed passwords
class UserManager {
    constructor() {
        this.users = new Map();
        this.initializeDemoUsers();
    }
    
    // Hash password using crypto
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    
    // Initialize demo users with hashed passwords
    initializeDemoUsers() {
        const demoUsers = [
            { username: 'admin', password: 'password123' },
            { username: 'user1', password: 'mypassword' },
            { username: 'john', password: 'john123' }
        ];
        
        demoUsers.forEach(user => {
            this.users.set(user.username, {
                username: user.username,
                passwordHash: this.hashPassword(user.password),
                originalPassword: user.password, // For demo purposes only
                createdAt: new Date().toISOString(),
                isActive: true
            });
        });
    }
    
    // Validate user credentials
    validateUser(username, password) {
        try {
            if (!username || !password) return false;
            
            const user = this.users.get(username);
            if (!user || !user.isActive) return false;
            
            const passwordHash = this.hashPassword(password);
            return user.passwordHash === passwordHash;
        } catch (error) {
            console.error('User validation error:', error);
            return false;
        }
    }
    
    // Check if user exists
    userExists(username) {
        try {
            const user = this.users.get(username);
            return user && user.isActive;
        } catch (error) {
            console.error('User existence check error:', error);
            return false;
        }
    }
    
    // Get demo credentials for logging
    getDemoCredentials() {
        return Array.from(this.users.values()).map(user => ({
            username: user.username,
            password: user.originalPassword
        }));
    }
    
    // Add new user (for future expansion)
    addUser(username, password) {
        try {
            if (this.users.has(username)) {
                throw new Error('User already exists');
            }
            
            this.users.set(username, {
                username,
                passwordHash: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                isActive: true
            });
            
            return true;
        } catch (error) {
            console.error('Add user error:', error);
            return false;
        }
    }
    
    // Deactivate user
    deactivateUser(username) {
        try {
            const user = this.users.get(username);
            if (user) {
                user.isActive = false;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Deactivate user error:', error);
            return false;
        }
    }
}

module.exports = new UserManager();