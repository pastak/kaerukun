const path = require('path');

module.exports = (configOption = 'kaerukun.config.js') => {
  if (typeof configOption === 'function') return configOption();
  let config;
  try {
    config = require(path.resolve(configOption));
    } catch (e) {} // eslint-disable-line
  if (typeof config === 'function') {
    return config();
  } else {
    return {};
  }
};
