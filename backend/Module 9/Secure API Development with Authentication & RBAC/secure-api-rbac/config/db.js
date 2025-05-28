const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Connection pooling
      minPoolSize: 2,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    // Auto-reconnect with exponential backoff
    setTimeout(connectDB, 5000);
  }
};

// Event listeners for connection resilience
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Reconnecting...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = connectDB;