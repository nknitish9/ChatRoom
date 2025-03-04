const socket = io();
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');
const exitButton = document.getElementById('exitButton');

const username = localStorage.getItem('username');
if (!username) {
    window.location.href = 'index.html';
} else {
    socket.emit('join', username);
}

// Function to send messages
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
}

// Send message when clicking send button
sendButton.addEventListener('click', sendMessage);

// Send message when pressing "Enter"
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Receive chat messages
socket.on('chatMessage', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (msg.user === username) {
        messageElement.classList.add('you');
        messageElement.textContent = `You: ${msg.text}`;
    } else {
        messageElement.classList.add('others');
        messageElement.textContent = `${msg.user}: ${msg.text}`;
    }
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Receive system messages (join/leave notifications)
socket.on('systemMessage', (msg) => {
    const systemElement = document.createElement('div');
    systemElement.classList.add('system-message');
    systemElement.textContent = msg;
    messagesDiv.appendChild(systemElement);
});

// Exit button functionality
exitButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
});
