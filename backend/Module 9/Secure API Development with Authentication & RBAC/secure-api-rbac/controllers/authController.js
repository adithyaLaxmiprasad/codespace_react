const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const CryptoJS = require('crypto-js');

// Encrypt JWT secret
const encryptSecret = (secret) => {
  return CryptoJS.AES.encrypt(secret, 'encryption-key').toString();
};

// Decrypt JWT secret
const decryptSecret = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, 'encryption-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  // Security audit logging
  console.log(`[AUTH] Login attempt from ${req.ip} for user: ${username}`);

  try {
    const user = await User.findOne({ username });
    const errorMessage = 'Invalid credentials';
    
    if (!user) {
      return res.status(401).json({ error: errorMessage });
    }

    // Account lock check
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const retryAfter = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(403).json({
        error: 'Account locked',
        retryAfter: `${retryAfter} seconds`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Increment failed attempts
      user.loginAttempts += 1;
      
      // Lock account after 3 failed attempts for 5 minutes
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 5 * 60 * 1000; // 5 min lock
      }
      
      await user.save();
      return res.status(401).json({ error: errorMessage });
    }

    // Reset on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Use encrypted secret
    const decryptedSecret = decryptSecret(process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      decryptedSecret,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(`[AUTH ERROR] ${err.message}`);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(`[REGISTRATION ERROR] ${err.message}`);
    
    let errorMessage = 'Registration failed';
    if (err.name === 'ValidationError') {
      errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
    }
    
    res.status(500).json({ error: errorMessage });
  }
};