const path = require('path');
                              //proccess.mainModule Depricated
module.exports = path.dirname(require.main.filename);   