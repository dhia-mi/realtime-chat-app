

const chatform = document.getElementById('chat-form');
const chatmessage = document.querySelector('.chat-message');
const userslise = document.getElementById('users');
const roomname= document.getElementById('rome-name');

const socket= io();

const {username, room} = Qs.parse(location.search ,{
    ignoreQueryPrefix :true
});

socket.emit("chatjoin",{username, room});

socket.on('chatroom', ({room, listusers}) => {
    outputuserslist(listusers);
    console.log(listusers);
    outputroomname(room);
});



socket.on("message", message => {
    console.log(message);
    outputmessage(message);
    chatmessage.scrollTop = chatmessage.scrollHeight;
    
});






chatform.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    
    socket.emit("chatmessage", msg);
    
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});



function outputuserslist(l) {
    users.innerHTML=`
        ${l.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
function outputroomname(name) {
    roomname.innerText=name;
}


function outputmessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} ${message.time}</p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-message').appendChild(div);
};