var socket = io();
var uploader = new SocketIOFileClient(socket);
var form = document.getElementById('form1');
var url = window.location.search;
var splitUrl = url.split('/');
console.log(splitUrl[0]);
console.log(splitUrl[1]);
var index = splitUrl[1];
var spliturl2 = splitUrl[0].split("?id=");
var params = spliturl2[1];
console.log(params);
console.log(index);

form.onsubmit = function(ev){
  ev.preventDefault();
  //send file Element to upload
  var fileEl = document.getElementById('file1');
  console.log(fileEl.value);
  var uploadIds = uploader.upload(fileEl.files);
}

function updateDatabase(){
        var id = params;
        var indexq = index;
        var raw = document.getElementById('file1').value;
        console.log(raw);
        var split = raw.split("\\").pop();
        console.log(split);
        var question = split;
        var correct = document.getElementById('benar').value;
        var pertanyaan = document.getElementById('per').value;
        var pembahasan = document.getElementById('pemb').value;

    var quiz = {
      id: params,
      index:indexq,
      question: question,
      pertanyaan: pertanyaan,
      correct: correct,
      pembahasan: pembahasan

  };
    socket.emit('updateSatuSoalGambar', quiz);
    window.history.back();
}

socket.on('connect',function(data){
  socket.emit('requestlistsatugambar',{
    id:params,
    index:index
  });
});

socket.on('responlistsatugambar', function(data){
  var correct = document.getElementById('benar');
  var pertanyaan = document.getElementById('per');
  var pembahasan = document.getElementById('pemb');

  correct.value = data.kb;
  pertanyaan.value = data.per;
  pembahasan.value = data.pemb;
});


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
