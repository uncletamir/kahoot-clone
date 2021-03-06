var socket = io();
var params = jQuery.deparam(window.location.search);
console.log(params);
var startTime;

setInterval(function(){
  startTime = Date.now();
  socket.emit('ping');
},2000);

socket.on('pong', function(){
  latency = Date.now() - startTime;
  console.log(latency);
});
//When host connects to server
socket.on('connect', function() {

    document.getElementById('players').value = "";
    console.log(params);
    //Tell server that it is host connection
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
});

//Adds player's name to screen and updates player count
socket.on('updatePlayerLobby', function(data){

    document.getElementById('players').value = "";

    for(var i = 0; i < data.length; i++){
        document.getElementById('players').value += data[i].name + "\n";
    }

});

//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGame');
}
function editmodul(){
    //socket.emit('editmodul');
    alert("halo");
}
function endGame(){
    window.location.href = "/";
}

//When server starts the game
socket.on('gameStarted', function(id){
    console.log('Game Started!');
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});
