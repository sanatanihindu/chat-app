// script.js
const socket = io();

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');
const generateQrButton = document.getElementById('generate-qr');
const qrCodeDiv = document.getElementById('qr-code');

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        const encryptedMessage = btoa(message); // Basic encoding for simplicity
        socket.emit('message', encryptedMessage);
        messageInput.value = '';
    }
});

// Receive message
socket.on('message', (encryptedMessage) => {
    const message = atob(encryptedMessage); // Decode message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
});

// Self-destruct chat
window.addEventListener('beforeunload', () => {
    messagesDiv.innerHTML = ''; // Clear messages on exit
});

// Generate QR code
generateQrButton.addEventListener('click', () => {
    fetch('/generate-qr')
        .then(response => response.text())
        .then(data => {
            qrCodeDiv.innerHTML = data; // Display the QR code
        })
        .catch(error => console.error('Error generating QR code:', error));
});