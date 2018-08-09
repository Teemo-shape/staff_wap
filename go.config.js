module.exports = {
  apps: [{
    name: "tcl-staff-wap",
    script: "./node_modules/nuxt/bin/nuxt-start",
    // script:"build/main.js",
    instances: 'max',
    exec_mode: "cluster",
    error_file: "./log/error.log",
    out_file: "./log/web.log",
    autorestart: true,
    max_memory_restart: "1000M",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    merge_logs: true
  }]
}
