var socket = io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var timer;
var time = 30;
document.getElementById('rightquestion').style.visibility = "hidden";
document.getElementById('pembahasan').style.visibility = "hidden";
document.getElementById('nextQButton').style.visibility = "hidden";
document.getElementById('gameend').style.visibility = "hidden";
document.getElementById('tolobby').style.visibility = "hidden";

//When host connects to server
socket.on('connect', function() {

    //Tell server that it is host connection from game view
    socket.emit('host-join-game-gambar', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../main';//Redirect user to 'join game' page
});

socket.on('gameQuestionsGambar', function(data){
  console.log(data);
    console.log(data.q1);
    console.log(data.p1);
    document.getElementById('rightquestion').style.visibility = "hidden";
    document.getElementById('pembahasan').style.visibility = "hidden";
    document.getElementById('nextQButton').style.visibility = "hidden";
    document.getElementById('gameend').style.visibility = "hidden";
    document.getElementById('game-image-blr').innerHTML = '<img src="../../data/' + data.q1 + '"/>';
    document.getElementById('game-image-blr').classList.add("blureed1");
    document.getElementById('rightquestion').innerHTML = data.correct;
    document.getElementById('pertanyaan').innerHTML = data.p1;
    document.getElementById('pembahasan').innerHTML = data.pembahasan;
    document.getElementById('tolobby').style.visibility = "hidden";



    var correctAnswer = data.correct;
    document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();

});

socket.on('updatePlayersAnsweredGambar', function(data){
   document.getElementById('playersAnsweredGambar').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame;
});

socket.on('questionOverGambar', function(playerData, correct){
    clearInterval(timer);
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    document.getElementById('game-image-blr').removeAttribute("class");
    document.getElementById('game-image-blr').style.visibility = "visible";
    document.getElementById('rightquestion').style.visibility = "visible";
    document.getElementById('pembahasan').style.visibility = "visible";
    document.getElementById('nextQButton').style.visibility = "visible";
    document.getElementById('tolobby').style.visibility = "hidden";

});

function nextQuestion(){
    document.getElementById('game-image-blr').style.visibility = "visible";
    document.getElementById('nextQButton').style.visible = "hidden";
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = "30";
    document.getElementById('tolobby').style.visibility = "hidden";
    socket.emit('nextQuestionGambar'); //Tell server to start new question
}

function updateTimer(){
    time = 30;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;

        if(time == 25){
          document.getElementById('game-image-blr').classList.remove("blureed1");
          document.getElementById('game-image-blr').classList.add("blureed2");
        }
        if(time == 20){
          document.getElementById('game-image-blr').classList.remove("blureed2");
          document.getElementById('game-image-blr').classList.add("blureed3");
        }
        if(time == 15){
          document.getElementById('game-image-blr').classList.remove("blureed3");
          document.getElementById('game-image-blr').classList.add("blureed4");
        }
        if(time == 0){
          document.getElementById('game-image-blr').classList.remove("blureed4");
            socket.emit('timeUpGambar');

        }
    }, 1000);
}

socket.on('GameOverGambar', function(data){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('pembahasan').style.display = "none";
    document.getElementById('pertanyaan').style.display = "none";
    document.getElementById('game-image-blr').style.display = "none";
    document.getElementById('rightquestion').style.display = "none";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('gameend').style.display = "block";
    document.getElementById('tolobby').style.visibility = "visible";
    document.getElementById('gameend').innerHTML = "Permainan Selesai";
    document.getElementById('playersAnswered').innerHTML = "";

    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "block";
    document.getElementById('winner5').style.display = "block";
    document.getElementById('winnerTitle').style.display = "block";

    document.getElementById('winner1').innerHTML = "1. " + data.num1;
    document.getElementById('winner2').innerHTML = "2. " + data.num2;
    document.getElementById('winner3').innerHTML = "3. " + data.num3;
    document.getElementById('winner4').innerHTML = "4. " + data.num4;
    document.getElementById('winner5').innerHTML = "5. " + data.num5;
});



socket.on('getTimeGambar', function(player){
    socket.emit('timeGambar', {
        player: player,
        time: time
    });
});
