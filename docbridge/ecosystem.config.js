module.exports = {
  apps: [
    {
      name: 'docbridge-gateway',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/gateway',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-auth',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/auth-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-consultation',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/consultation-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-prescription',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/prescription-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-reminder',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/reminder-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-labreport',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/labreport-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-symptom',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/symptom-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-ai-companion',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/ai-companion-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-health-summary',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/health-summary-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'docbridge-family',
      script: 'src/server.js',
      cwd: '/home/ubuntu/docbridge/services/family-service',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' }
    }
  ]
};
