module.exports = {
  apps: [
    {
      name: "foz-em-foco",
      script: "node_modules/.bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
