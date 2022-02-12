var socket = io();
var uploader = new SocketIOFileClient(socket);
var form = document.getElementById('form1');

var questionNum = 1; //Starts at two because question 1 is already present

window.onload = function(){

};


form.onsubmit = function(ev) {
 ev.preventDefault();

 // Send File Element to upload
 var fileEl = document.getElementById('file1');
 // var uploadIds = uploader.upload(fileEl);
 console.log(fileEl.value);
 // Or just pass file objects directly
 var uploadIds = uploader.upload(fileEl.files);
};

function updateDatabase(){
    var questions = [];
    var name = document.getElementById('name').value;
    console.log(name);
        var id = 1;
        var raw = document.getElementById('file1').value;
        console.log(raw);
        var split = raw.split("\\").pop();
        console.log(split);
        var question = split;
        var pertanyaan = document.getElementById('p1').value;
        var correct = document.getElementById('correct1').value;
        var pembahasan = document.getElementById('pembahasan1').value;

        questions.push({"id":id,"question": question,"pertanyaan": pertanyaan, "correct": correct, 'pembahasan': pembahasan})

    var quiz = {id: 0, "name": name, "questions": questions,};
    socket.emit('uploadimage', quiz);
    socket.on('resuploadgambar', function(data){
      window.location.href="../../editgambar/" + "?id=" + data;
    })
}


//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../datasoalgambar";
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
