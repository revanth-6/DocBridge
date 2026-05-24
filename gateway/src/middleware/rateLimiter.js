const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again in a few minutes.',
      timestamp: new Date().toISOString(),
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.',
      timestamp: new Date().toISOString(),
    });
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-user-id'] || req.ip,
  handler: (req, res) => {
    logger.warn(`AI rate limit exceeded: user=${req.headers['x-user-id'] || req.ip}`);
    res.status(429).json({
      success: false,
      message: 'You have reached the AI chat limit. Please wait a few minutes before trying again.',
      timestamp: new Date().toISOString(),
    });
  },
});

module.exports = { generalLimiter, authLimiter, aiLimiter };
