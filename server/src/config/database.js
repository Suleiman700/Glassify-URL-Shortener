const path = require('path');

module.exports = {
    DB_PATH: path.join(__dirname, '../../urls.json'),
    DEFAULT_DB_STRUCTURE: {
        urls: {},
        userUrls: {}
    }
};
