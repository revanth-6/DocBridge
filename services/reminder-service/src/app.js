const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const morgan = require('morgan');
const env = require('./config/environment');
const logger = require('./config/logger');
const routes = require('./routes/reminderRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(hpp());
app.use(morgan('combined', { stream: logger.stream }));

app.use('/api/v1/reminders', routes);

app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const { sequelize } = require('./config/database');
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }
  res.json({
    status: 'healthy',
    service: 'reminder-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', timestamp: new Date().toISOString() });
});

app.use((err, req, res, _next) => {
  logger.error('Unhandled error:', { message: err.message, stack: env.NODE_ENV === 'development' ? err.stack : undefined, path: req.originalUrl });
  res.status(err.statusCode || 500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
