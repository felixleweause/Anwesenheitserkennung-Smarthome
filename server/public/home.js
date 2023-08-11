var socket = io();
socket.on('update', function(data) {
    document.getElementById(data.nutzer).innerText  = "Raum:  " + data.raum;
});