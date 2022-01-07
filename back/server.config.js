module.exports = {
  apps: [
    {
      name: 'marvel-academy-backend',
      script: './index.js',
      instances: 'max',
      exec_mode: 'cluster',
      instance_var: 'INSTANCE_ID',
      watch: false,
      max_memory_restart: '1G',
      autorestart: true,
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'development', //production, development
        PORT: '4000',
      },
      env_production: {
        PORT: '4000',
        NODE_ENV: 'production',
      },
    },
  ],
};

// pm2 start server.config.js
