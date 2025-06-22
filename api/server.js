// api/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/generate-qr', (req, res) => {
    const secretCode = "YourSecretCode"; // Generate a random secret code in production
    QRCode.toDataURL(secretCode)
        .then(url => {
            res.send(`<img src="${url}"><p>Secret Code: ${secretCode}</p>`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error generating QR code');
        });
});

// Export the server for Vercel
module.exports = (req, res) => {
    server(req, res);
};

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});