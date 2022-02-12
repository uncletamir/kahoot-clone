var socket = io();
var url = window.location.search;
var splitUrl = url.split('/');
console.log("splitUrl0:"+ " " + splitUrl[0]);
console.log("splitUrl1"+" " + splitUrl[1]);
var index = splitUrl[1]+1;
console.log(index);
var idindex = parseInt(splitUrl[1])+1;
console.log(idindex);
var spliturl2 = splitUrl[0].split("?id=");
var params = spliturl2[1];



function updateDatabase(){
        var id = params;
        var index = idindex;
        var question = document.getElementById('acak').value;
        var correct = document.getElementById('benar').value;
        var pertanyaan = document.getElementById('per').value;
        var pembahasan = document.getElementById('pemb').value;

    var quiz = {
      id: params,
      index:index,
      question: question,
      pertanyaan: pertanyaan,
      correct: correct,
      pembahasan: pembahasan

  };
    socket.emit('tambahSatuSoal', quiz);
    window.history.back();
}


//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.history.back();
    }
}

socket.on('startGameFromCreator', function(data){
    window.location.href = "../../host/?id=" + data;
});

function randomColor(){

    var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
    var randomNum = Math.floor(Math.random() * 4);
    return colors[randomNum];
}

function setBGColor(){
    var randColor = randomColor();
    document.getElementById('question-field').style.backgroundColor = randColor;
}
