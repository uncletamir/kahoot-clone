var socket = io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var timer;
var time = 30;
document.getElementById('rightquestion').style.visibility = "hidden";
document.getElementById('pembahasan').style.visibility = "hidden";
document.getElementById('nextQButton').style.visibility = "hidden";
document.getElementById('tolobby').style.visibility = "hidden";

//When host connects to server
socket.on('connect', function() {

    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../main';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data){
  //shuffle question
  //  acak = data.q1,
      function shuffle (x) {
        var a = x.split("");
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }

      console.log(shuffle(data.q1));

    document.getElementById('question').innerHTML = shuffle(data.q1);
    document.getElementById('rightquestion').innerHTML = data.q1;
    document.getElementById('pertanyaan').innerHTML = data.p1;
    document.getElementById('pembahasan').innerHTML = data.pembahasan;
    document.getElementById('rightquestion').style.visibility = "hidden";
    document.getElementById('pembahasan').style.visibility = "hidden";
    document.getElementById('nextQButton').style.visibility = "hidden";
    document.getElementById('tolobby').style.visibility = "hidden";

    var correctAnswer = data.correct;
    document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();
});

socket.on('updatePlayersAnswered', function(data){
   document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame;
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    document.getElementById('question').style.visibility = "hidden";
    document.getElementById('rightquestion').style.visibility = "visible";
    document.getElementById('pembahasan').style.visibility = "visible";
    document.getElementById('nextQButton').style.visibility = "visible";
    document.getElementById('tolobby').style.visibility = "hidden";
});

function nextQuestion(){
    document.getElementById('question').style.visibility = "visible";
    document.getElementById('nextQButton').style.visible = "hidden";
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('tolobby').style.visibility = "hidden";
    document.getElementById('num').innerHTML = " 30";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer(){
    time = 30;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time == 0){
            socket.emit('timeUp');
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('pembahasan').style.display = "none";
    document.getElementById('pertanyaan').style.display = "none";
    document.getElementById('rightquestion').style.display = "none";
    document.getElementById('tolobby').style.visibility = "visible";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').innerHTML = "Permainan Selesai";
    document.getElementById('playersAnswered').innerHTML = "";

    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "block";
    document.getElementById('winner5').style.display = "block";
    document.getElementById('winnerTitle').style.display = "block";

    document.getElementById('winner1').innerHTML = "1. " + data.num1;
    document.getElementById('score1').innerHTML =":" + data.scr1;
    document.getElementById('winner2').innerHTML = "2. " + data.num2;
    document.getElementById('winner3').innerHTML = "3. " + data.num3;
    document.getElementById('winner4').innerHTML = "4. " + data.num4;
    document.getElementById('winner5').innerHTML = "5. " + data.num5;
});



socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});
