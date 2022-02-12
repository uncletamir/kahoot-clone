var socket = io();
var params = jQuery.deparam(window.location.search);
console.log(params);
//When host connects to server
socket.on('connect', function() {

    document.getElementById('players').value = "";
    console.log(params);
    //Tell server that it is host connection
    socket.emit('host-join-gambar', params);
});

socket.on('showGameGambarPin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
});

//Adds player's name to screen and updates player count
socket.on('updatePlayerLobbyGambar', function(data){

    document.getElementById('players').value = "";

    for(var i = 0; i < data.length; i++){
        document.getElementById('players').value += data[i].name + "\n";
    }

});

//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGameGambar');
}
function editmodul(){
    //socket.emit('editmodul');
    alert("halo");
}
function endGame(){
    window.location.href = "/";
}

//When server starts the game
socket.on('gameGambarStarted', function(id){
    console.log('Game Started!');
    window.location.href="/hostacakgambar/game/" + "?id=" + id;
});

socket.on('noGameGambarFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});
