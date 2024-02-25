// cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache();

// Cache expiration time in seconds (e.g., 300 seconds = 5 minutes)
const CACHE_EXPIRATION_TIME = 300;

// Function to cache data
const cacheData = (key, data) => {
  cache.set(key, data, CACHE_EXPIRATION_TIME);
};

// Function to retrieve cached data
const getCachedData = (key) => {
  return cache.get(key);
};

module.exports = {
  cacheData,
  getCachedData,
};
