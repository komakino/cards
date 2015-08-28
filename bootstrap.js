var path = require('path');
global.appRoot = path.resolve(__dirname);

require(appRoot + '/app/backend/app.js');