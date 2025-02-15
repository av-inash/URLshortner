// server.js - Entry point
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../docs/swagger.json')
const mongoose = require('mongoose');
const { createClient } = require('redis')


const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');

const analyticsRoutes = require('./routes/analyticsRoutes');
const swaggerSpec = require('../docs/swaggerConfig');
require('dotenv').config(); 



// Load environment variables
dotenv.config();

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))
//   .catch(error => {
//       console.error('MongoDB Connection Error:', error);
//       process.exit(1);
//   });
mongoose.connect(`mongodb+srv://hydroavinash:avinash123@cluster0.itxqn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => console.log('MongoDB Connected'))
  .catch(error => {
      console.error('MongoDB Connection Error:', error);
      process.exit(1);
  });

// Connect to Redis
const redisClient = createClient({ url: process.env.REDIS_URI });
redisClient.on('error', (err) => console.error('Redis Error:', err));
redisClient.connect().then(() => console.log('Redis Connected')).catch(console.error);

const app = express();

// Middleware
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimiter);
app.use(compression());

// Serve API documentation
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static files (optional for frontend hosting)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'URL Shortener API is running.' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await redisClient.disconnect();
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;

// Jest & Supertest for Unit Testing
if (process.env.NODE_ENV === 'test') {
    module.exports = app;
}

// GitHub Actions CI/CD
// .github/workflows/ci-cd.yml
/**
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: echo "Deployment steps go here"
*/
