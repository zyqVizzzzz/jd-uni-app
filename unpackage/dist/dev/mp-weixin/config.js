"use strict";
const config = {
  development: {
    API_BASE_URL: "http://localhost:3000"
    // API_BASE_URL: "http://43.143.120.59:3000",
    // API_BASE_URL: "https://api.jazzdawn.com",
  },
  production: {
    API_BASE_URL: "https://api.jazzdawn.com"
  }
};
const env = "development";
const config$1 = config[env];
exports.config = config$1;
