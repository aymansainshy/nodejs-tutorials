const moment = require('moment');

function formatMessage(userName, messageContent) {
    return {
        userName,
        messageContent,
        time: moment().format('h:mm a')
    };
}


module.exports = formatMessage;