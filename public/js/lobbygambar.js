var socket = io();

//When player connects to server
socket.on('connect', function() {

    var params = jQuery.deparam(window.location.search); //Gets data from url

    //Tell server that it is player connection
    socket.emit('player-join-gambar', params);
});

//Boot player back to join screen if game pin has no match
socket.on('noGameFound', function(){
    window.location.href = '../main';
});
//If the host disconnects, then the player is booted to main screen
socket.on('hostDisconnect', function(){
    window.location.href = '../main.html';
});

//When the host clicks start game, the player screen changes
socket.on('gameGambarStartedPlayer', function(){
    window.location.href="/playeracakgambar/game/" + "?id=" + socket.id;
});
