const mongoose = require('mongoose');
const monitor = require('pm2').monitor();

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.poolSize = process.env.NODE_ENV === 'production' ? 50 : 10;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  async connect() {
    try {
      this.connection = await mongoose.createConnection(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: this.poolSize,
        minPoolSize: 5,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        waitQueueTimeoutMS: 10000
      });

      console.log('MongoDB Connected');
      this.reconnectAttempts = 0;
      
      // Monitor connection health
      setInterval(() => this.checkHealth(), 30000);
      
      return this.connection;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleError(error) {
    const errorMap = {
      MongoNetworkError: 'Network issue detected',
      MongoTimeoutError: 'Connection timed out',
      MongoServerSelectionError: 'Server selection failed',
      default: 'Database connection error'
    };
    
    const errorType = errorMap[error.name] || errorMap.default;
    console.error(`[DB ERROR] ${errorType}: ${error.message}`);
    
    // Implement exponential backoff
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      this.reconnectAttempts++;
      
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnect attempts reached');
      process.exit(1);
    }
  }

  async checkHealth() {
    try {
      const adminDb = this.connection.db.admin();
      const status = await adminDb.ping();
      
      if (!status.ok) {
        console.warn('[DB HEALTH] Ping failed - connection unstable');
        monitor.notify('DB connection unstable');
      }
    } catch (error) {
      console.error('[DB HEALTH] Check failed:', error.message);
    }
  }

  // Graceful shutdown
  async disconnect() {
    try {
      await this.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing connection:', error.message);
    }
  }
}

module.exports = new DatabaseManager();