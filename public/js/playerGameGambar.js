var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game-gambar', params);
    document.getElementById("myBtn").style.visibility = "visible";
    document.getElementById("tolobby").style.visibility = "hidden";

});

socket.on('noGameGambarFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page
});

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        socket.emit('playerAnswerGambar', num);//Sends player answer to server
        console.log(myBtn);
        //Hiding buttons from user
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById("myBtn").style.visibility = "hidden";
        document.getElementById("tolobby").style.visibility = "hidden";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Jawaban sudah di kunci, tunggu pemain yang lain...";

    }
}

//Get results on last question
socket.on('answerResultGambar', function(data){
    if(data == true){
        correct = true;
    }
});

socket.on('questionOverGambar', function(data){
    if(correct == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct!";
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrect!";
    }
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById("myBtn").style.visibility = "hidden";
    document.getElementById("tolobby").style.visibility = "hidden";
    socket.emit('getScoreGambar');
});

socket.on('newScoreGambar', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

socket.on('nextQuestionGambarPlayer', function(){
    correct = false;
    playerAnswered = false;

    document.getElementById('answer1').value = '';
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById("myBtn").style.visibility = "visible";
    document.getElementById("tolobby").style.visibility = "hidden";
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "white";

});

socket.on('hostGambarDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameGambarData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOverGambar', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById("myBtn").style.visibility = "hidden";
    document.getElementById("tolobby").style.visibility = "visible";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "Permainan Selesai";
});
