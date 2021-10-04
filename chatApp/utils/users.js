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


// user Leaves Chat 
function userLeaves(id) {
    const index = users.findIndex(user => user.id == id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}


// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


module.exports = { getCurrentUser, userJoin, userLeaves, getRoomUsers };