const users = [];

// Join User to the chat 
function userJoin(id, userName, room) {
    const user = { id, userName, room };

    users.push(user);
    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


module.exports = { getCurrentUser, userJoin };