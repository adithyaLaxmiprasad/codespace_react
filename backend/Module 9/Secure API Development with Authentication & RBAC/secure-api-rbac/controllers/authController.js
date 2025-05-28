const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { performance } = require('perf_hooks');
const crypto = require('crypto');
const zxcvbn = require('zxcvbn'); // Password strength estimator

// Cache for secret to minimize cryptographic operations
let secretCache = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastCacheUpdate = 0;

const getDecryptedSecret = () => {
  const now = Date.now();
  
  // Use cached secret if within TTL
  if (secretCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return secretCache;
  }
  
  // Decrypt using optimized method
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(process.env.JWT_SECRET, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  secretCache = decrypted;
  lastCacheUpdate = now;
  
  return decrypted;
};

exports.login = async (req, res) => {
  const startTime = performance.now();
  const { username, password } = req.body;
  
  // Security audit logging
  console.log(`[AUTH] Login attempt from ${req.ip} for user: ${username}`);

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Optimized query with projection
    const user = await User.findOne({ username })
      .select('username password role loginAttempts lockUntil')
      .lean();
    
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

    // Performance optimized bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Update only necessary fields
      await User.updateOne(
        { _id: user._id },
        { 
          $inc: { loginAttempts: 1 },
          ...(user.loginAttempts >= 2 && { lockUntil: Date.now() + 5 * 60 * 1000 })
        }
      );
      
      return res.status(401).json({ error: errorMessage });
    }

    // Reset on successful login
    await User.updateOne(
      { _id: user._id },
      { $set: { loginAttempts: 0, lockUntil: null } }
    );

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getDecryptedSecret(),
      { expiresIn: '1h' }
    );

    // Performance monitoring
    const endTime = performance.now();
    console.log(`[PERF] Login processed in ${(endTime - startTime).toFixed(2)}ms`);
    
    res.json({ token });
  } catch (err) {
    console.error(`[AUTH ERROR] ${err.message}`);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;

  // Enhanced input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  // Password strength validation
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return res.status(400).json({ 
      error: 'Password too weak',
      suggestions: passwordStrength.feedback.suggestions
    });
  }

  try {
    // Optimized existence check
    const userExists = await User.exists({ username });
    if (userExists) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Parallelize hashing operations
    const [salt, hashedPassword] = await Promise.all([
      bcrypt.genSalt(10),
      bcrypt.hash(password, 10)
    ]);
    
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
      errorMessage = Object.values(err.errors)
        .map(val => val.message)
        .join(', ');
    } else if (err.code === 11000) {
      errorMessage = 'Username already exists';
    }
    
    res.status(500).json({ error: errorMessage });
  }
};