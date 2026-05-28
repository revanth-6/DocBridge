module.exports = {
  apps: [
    {
      name: 'docbridge-gateway',
      script: 'src/server.js',
      cwd: './gateway',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-auth',
      script: 'src/server.js',
      cwd: './services/auth-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-consultation',
      script: 'src/server.js',
      cwd: './services/consultation-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-prescription',
      script: 'src/server.js',
      cwd: './services/prescription-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-reminder',
      script: 'src/server.js',
      cwd: './services/reminder-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-labreport',
      script: 'src/server.js',
      cwd: './services/labreport-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-symptom',
      script: 'src/server.js',
      cwd: './services/symptom-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-ai-companion',
      script: 'src/server.js',
      cwd: './services/ai-companion-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-health-summary',
      script: 'src/server.js',
      cwd: './services/health-summary-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-family',
      script: 'src/server.js',
      cwd: './services/family-service',
      instances: 1,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    }
  ]
};
