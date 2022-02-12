var socket = io();
var params = jQuery.deparam(window.location.search);
console.log(params);
 //Starts at two because question 1 is already present

function updateDatabase(){
    var questions = [];
    var name = document.getElementById('name').value;
    console.log(name);
        var id = i;
        var question = document.getElementById('q').value;
        var pertanyaan = document.getElementById('p').value;
        var correct = document.getElementById('correct').value;
        var pembahasan = document.getElementById('pembahasan').value;

        questions.push({"id":id,"question": question,"pertanyaan": pertanyaan, "correct": correct, 'pembahasan': pembahasan})



    var quiz = {id: 0, "name": name, "questions": questions,};
    socket.emit('newQuiz', quiz);
}


function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../datasoal";
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

function removechild(){
  var div = document.getElementById('quesion-field');
    div.parentNode.removeChild(div);
}
