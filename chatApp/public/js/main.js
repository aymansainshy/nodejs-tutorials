const chatForm = document.getElementById('chat-form');
const chatmessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get userName and Room ....
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


// console.log(username, room);


const socket = io();

// Jion Chat Room 
socket.emit("joinRoom", { username, room });


// Get users and room 
socket.on('roomUser', ({ room, users }) => {
    outputRoomName(room);
    outPutUserName(users);
});


// Message from server ... 
socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    chatmessages.scrollTop = chatmessages.scrollHeight;
});


// Message Submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text ..
    const msg = e.target.elements.msg.value;

    // emiting message to server ....
    socket.emit('chatMessage', msg);
    // console.log(msg);

    // Clear Text after emiting message 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Out put message to DOM 
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
                     <p class="text">${message.messageContent}</p>`

    document.querySelector('.chat-messages').appendChild(div);
}


// Add room Name to DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM 
function outPutUserName(users) {
    userList.innerHTML = `
       ${users.map(user => `<li>${user.userName}</li>`).join('')}
    `;
}